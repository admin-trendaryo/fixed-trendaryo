/**
 * SELF-HEALING ERROR MANAGEMENT SYSTEM
 * Comprehensive error handling with auto-recovery mechanisms
 */

const fs = require('fs');
const path = require('path');
const winston = require('winston');

// ============================================================================
// LOGGER CONFIGURATION
// ============================================================================

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'trendaryo-api' },
  transports: [
    new winston.transports.File({ 
      filename: path.join(__dirname, '../../logs/error.log'), 
      level: 'error',
      maxsize: 10485760,
      maxFiles: 10
    }),
    new winston.transports.File({ 
      filename: path.join(__dirname, '../../logs/combined.log'),
      maxsize: 10485760,
      maxFiles: 10
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          return `${timestamp} [${level}]: ${message}`;
        })
      )
    })
  ]
});

// ============================================================================
// ERROR RECOVERY STRATEGIES
// ============================================================================

class ErrorRecoveryManager {
  constructor() {
    this.recoveryStrategies = new Map();
    this.errorHistory = [];
    this.maxHistorySize = 1000;
    this.initializeStrategies();
  }

  initializeStrategies() {
    this.registerStrategy('ECONNREFUSED', this.handleDatabaseConnectionError.bind(this));
    this.registerStrategy('PROTOCOL_ERROR', this.handleProtocolError.bind(this));
    this.registerStrategy('VALIDATION_ERROR', this.handleValidationError.bind(this));
    this.registerStrategy('AUTH_ERROR', this.handleAuthError.bind(this));
    this.registerStrategy('PAYMENT_ERROR', this.handlePaymentError.bind(this));
    this.registerStrategy('RATE_LIMIT', this.handleRateLimitError.bind(this));
    this.registerStrategy('TIMEOUT', this.handleTimeoutError.bind(this));
    this.registerStrategy('MEMORY_ERROR', this.handleMemoryError.bind(this));
  }

  registerStrategy(errorType, handler) {
    this.recoveryStrategies.set(errorType, handler);
  }

  async recover(error, context = {}) {
    try {
      const errorType = this.classifyError(error);
      const strategy = this.recoveryStrategies.get(errorType);

      this.recordError(error, errorType, context);

      if (strategy) {
        logger.warn(`Attempting recovery for ${errorType}`, { error: error.message });
        return await strategy(error, context);
      }

      logger.error(`No recovery strategy for ${errorType}`, { error: error.message });
      return { recovered: false, error };
    } catch (recoveryError) {
      logger.error('Recovery failed', { originalError: error.message });
      return { recovered: false, error: recoveryError };
    }
  }

  classifyError(error) {
    if (error.code === 'ECONNREFUSED') return 'ECONNREFUSED';
    if (error.message?.includes('PROTOCOL')) return 'PROTOCOL_ERROR';
    if (error.message?.includes('validation')) return 'VALIDATION_ERROR';
    if (error.message?.includes('auth') || error.message?.includes('token')) return 'AUTH_ERROR';
    if (error.message?.includes('payment')) return 'PAYMENT_ERROR';
    if (error.message?.includes('rate')) return 'RATE_LIMIT';
    if (error.message?.includes('timeout')) return 'TIMEOUT';
    if (error.message?.includes('memory')) return 'MEMORY_ERROR';
    return 'UNKNOWN_ERROR';
  }

  recordError(error, type, context) {
    const record = {
      timestamp: new Date().toISOString(),
      type,
      message: error.message,
      context,
      recovered: false
    };

    this.errorHistory.push(record);
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory.shift();
    }
  }

  async handleDatabaseConnectionError(error, context) {
    logger.info('Handling database connection error - attempting reconnection');
    for (let i = 0; i < 3; i++) {
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      try {
        if (context.db && typeof context.db.ping === 'function') {
          await context.db.ping();
          logger.info('Database reconnected successfully');
          return { recovered: true, retry: true };
        }
      } catch (e) {
        logger.warn(`Reconnection attempt ${i + 1} failed`);
      }
    }
    return { recovered: false, error };
  }

  async handleProtocolError(error, context) {
    logger.info('Handling protocol error - resetting connection');
    return { recovered: true, reset: true, retry: true };
  }

  async handleValidationError(error, context) {
    logger.info('Handling validation error');
    return { recovered: true, statusCode: 400, message: 'Validation failed' };
  }

  async handleAuthError(error, context) {
    logger.info('Handling auth error');
    return { recovered: true, statusCode: 401, message: 'Authentication failed', clearToken: true };
  }

  async handlePaymentError(error, context) {
    logger.info('Handling payment error');
    return { recovered: true, statusCode: 402, message: 'Payment processing failed', requiresManualReview: true };
  }

  async handleRateLimitError(error, context) {
    logger.info('Handling rate limit');
    return { recovered: true, statusCode: 429, message: 'Too many requests', retryAfter: 60 };
  }

  async handleTimeoutError(error, context) {
    logger.info('Handling timeout');
    return { recovered: true, retry: true, timeout: (context.timeout || 5000) * 2 };
  }

  async handleMemoryError(error, context) {
    logger.warn('Handling memory error');
    if (global.gc) global.gc();
    return { recovered: true, message: 'Memory cleared, please retry' };
  }

  getErrorHistory() {
    return this.errorHistory;
  }

  getErrorStats() {
    const stats = {};
    this.errorHistory.forEach(record => {
      stats[record.type] = (stats[record.type] || 0) + 1;
    });
    return stats;
  }
}

// ============================================================================
// CUSTOM ERROR CLASSES
// ============================================================================

class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, details = {}) {
    super(message, 400, 'VALIDATION_ERROR');
    this.details = details;
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401, 'AUTH_ERROR');
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409, 'CONFLICT');
  }
}

class PaymentError extends AppError {
  constructor(message, details = {}) {
    super(message, 402, 'PAYMENT_ERROR');
    this.details = details;
  }
}

class RateLimitError extends AppError {
  constructor(retryAfter = 60) {
    super('Too many requests', 429, 'RATE_LIMIT');
    this.retryAfter = retryAfter;
  }
}

// ============================================================================
// GLOBAL ERROR HANDLER
// ============================================================================

const recoveryManager = new ErrorRecoveryManager();

const globalErrorHandler = (err, req, res, next) => {
  const errorId = require('uuid').v4();
  
  logger.error('Unhandled error', {
    errorId,
    message: err.message,
    url: req.url,
    method: req.method
  });

  recoveryManager.recover(err, { req, url: req.url, method: req.method }).then(recovery => {
    if (recovery.recovered) {
      logger.info(`Error ${errorId} recovered`);
    }
  });

  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    error: {
      id: errorId,
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      ...(err.details && { details: err.details })
    }
  };

  res.status(statusCode).json(response);
};

// ============================================================================
// PROCESS-LEVEL ERROR HANDLERS
// ============================================================================

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason });
  recoveryManager.recover(new Error(String(reason)), { type: 'unhandledRejection' });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { error: error.message });
  recoveryManager.recover(error, { type: 'uncaughtException' });
  setTimeout(() => process.exit(1), 5000);
});

process.on('warning', (warning) => {
  logger.warn('Process Warning', { warning: warning.message });
});

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  logger,
  ErrorRecoveryManager,
  recoveryManager,
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  PaymentError,
  RateLimitError,
  globalErrorHandler
};
