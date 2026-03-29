/**
 * MAIN SERVER FILE
 * Express application with comprehensive middleware and error handling
 */

require('dotenv').config();
require('express-async-errors');

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');

const { logger, globalErrorHandler } = require('./src/utils/errorHandler');
const DatabaseManager = require('./src/utils/database');
const AuthManager = require('./src/utils/auth');

// ============================================================================
// INITIALIZATION
// ============================================================================

const app = express();
const db = new DatabaseManager();
const authManager = new AuthManager();

// Store instances globally for access in routes
app.locals.db = db;
app.locals.authManager = authManager;

// ============================================================================
// MIDDLEWARE SETUP
// ============================================================================

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Compression
app.use(compression());

// Request logging
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request ID middleware
app.use((req, res, next) => {
  req.id = uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'development'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // limit login attempts
  skipSuccessfulRequests: true
});

app.use('/api/', limiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// ============================================================================
// HEALTH CHECK ENDPOINT
// ============================================================================

app.get('/health', async (req, res) => {
  try {
    const health = await db.healthCheck();
    const stats = authManager.getTokenStats();
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: health,
      auth: stats,
      uptime: process.uptime(),
      memory: process.memoryUsage()
    });
  } catch (error) {
    logger.error('Health check failed', { error: error.message });
    res.status(503).json({
      status: 'error',
      error: error.message
    });
  }
});

// ============================================================================
// API ROUTES
// ============================================================================

// Auth routes
app.post('/api/auth/register', require('./src/routes/auth').register);
app.post('/api/auth/login', require('./src/routes/auth').login);
app.post('/api/auth/refresh', require('./src/routes/auth').refresh);
app.post('/api/auth/logout', authManager.authenticate(), require('./src/routes/auth').logout);

// Product routes
app.get('/api/products', require('./src/routes/products').getAll);
app.get('/api/products/:id', require('./src/routes/products').getById);
app.post('/api/products', authManager.authenticate(), authManager.authorize('admin'), require('./src/routes/products').create);
app.put('/api/products/:id', authManager.authenticate(), authManager.authorize('admin'), require('./src/routes/products').update);
app.delete('/api/products/:id', authManager.authenticate(), authManager.authorize('admin'), require('./src/routes/products').delete);

// Order routes
app.post('/api/orders', authManager.authenticate(), require('./src/routes/orders').create);
app.get('/api/orders', authManager.authenticate(), require('./src/routes/orders').getAll);
app.get('/api/orders/:id', authManager.authenticate(), require('./src/routes/orders').getById);
app.put('/api/orders/:id', authManager.authenticate(), require('./src/routes/orders').update);

// Cart routes
app.post('/api/cart', authManager.authenticate(), require('./src/routes/cart').add);
app.get('/api/cart', authManager.authenticate(), require('./src/routes/cart').get);
app.delete('/api/cart/:productId', authManager.authenticate(), require('./src/routes/cart').remove);

// Payment routes
app.post('/api/payments', authManager.authenticate(), require('./src/routes/payments').process);
app.get('/api/payments/:id', authManager.authenticate(), require('./src/routes/payments').getById);

// User routes
app.get('/api/users/profile', authManager.authenticate(), require('./src/routes/users').getProfile);
app.put('/api/users/profile', authManager.authenticate(), require('./src/routes/users').updateProfile);

// Admin routes
app.get('/api/admin/stats', authManager.authenticate(), authManager.authorize('admin'), require('./src/routes/admin').getStats);
app.get('/api/admin/errors', authManager.authenticate(), authManager.authorize('admin'), require('./src/routes/admin').getErrors);

// ============================================================================
// 404 HANDLER
// ============================================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.url} not found`
    }
  });
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

app.use(globalErrorHandler);

// ============================================================================
// SERVER STARTUP
// ============================================================================

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Initialize database
    logger.info('Initializing database...');
    await db.initialize();
    
    // Start health checks
    db.startHealthCheckInterval(30000);
    
    // Start token cleanup
    authManager.startCleanupInterval(3600000);
    
    // Start server
    const server = app.listen(PORT, () => {
      logger.info(`Server started successfully on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`Health check: http://localhost:${PORT}/health`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM received, shutting down gracefully...');
      server.close(async () => {
        await db.close();
        logger.info('Server shut down successfully');
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      logger.info('SIGINT received, shutting down gracefully...');
      server.close(async () => {
        await db.close();
        logger.info('Server shut down successfully');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  }
}

// Start the server
if (require.main === module) {
  startServer();
}

module.exports = app;
