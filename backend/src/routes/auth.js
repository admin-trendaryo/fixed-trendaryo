/**
 * AUTHENTICATION ROUTES
 * User registration, login, token refresh, and logout
 */

const { v4: uuidv4 } = require('uuid');
const { logger } = require('../utils/errorHandler');
const { ValidationError, AuthenticationError, ConflictError } = require('../utils/errorHandler');
const { validate, sanitize, schemas, businessValidators } = require('../utils/validation');

// ============================================================================
// REGISTER
// ============================================================================

const register = async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const authManager = req.app.locals.authManager;

    // Validate input
    const data = await validate(req.body, schemas.userRegister);
    
    // Sanitize data
    const sanitized = {
      email: sanitize.email(data.email),
      firstName: sanitize.string(data.firstName),
      lastName: sanitize.string(data.lastName),
      phone: sanitize.string(data.phone)
    };

    // Check if email already exists
    await businessValidators.validateUniqueEmail(db, sanitized.email);

    // Hash password
    const hashedPassword = await authManager.hashPassword(data.password);

    // Create user
    const userId = uuidv4();
    await db.run(
      `INSERT INTO users (id, email, password, firstName, lastName, phone, role, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, sanitized.email, hashedPassword, sanitized.firstName, sanitized.lastName, sanitized.phone, 'customer', 'active']
    );

    // Generate tokens
    const tokens = authManager.generateTokenPair(userId, 'customer');

    logger.info('User registered successfully', { userId, email: sanitized.email });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        userId,
        email: sanitized.email,
        ...tokens
      }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// LOGIN
// ============================================================================

const login = async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const authManager = req.app.locals.authManager;

    // Validate input
    const data = await validate(req.body, schemas.userLogin);
    
    // Sanitize email
    const email = sanitize.email(data.email);

    // Find user
    const user = await db.get('SELECT id, password, role, status FROM users WHERE email = ?', [email]);
    
    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    if (user.status !== 'active') {
      throw new AuthenticationError('Account is not active');
    }

    // Verify password
    const isPasswordValid = await authManager.comparePassword(data.password, user.password);
    
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Generate tokens
    const tokens = authManager.generateTokenPair(user.id, user.role);

    logger.info('User logged in successfully', { userId: user.id, email });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        userId: user.id,
        role: user.role,
        ...tokens
      }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// REFRESH TOKEN
// ============================================================================

const refresh = async (req, res, next) => {
  try {
    const authManager = req.app.locals.authManager;
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new ValidationError('Refresh token is required');
    }

    const result = authManager.refreshAccessToken(refreshToken);

    logger.info('Access token refreshed');

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// LOGOUT
// ============================================================================

const logout = async (req, res, next) => {
  try {
    const authManager = req.app.locals.authManager;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      authManager.revokeAccessToken(token);
    }

    // Revoke all refresh tokens for user
    authManager.revokeAllUserTokens(req.user.userId);

    logger.info('User logged out', { userId: req.user.userId });

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout
};
