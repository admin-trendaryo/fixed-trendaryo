/**
 * AUTHENTICATION & JWT MANAGEMENT
 * Secure token generation, validation, and refresh mechanisms
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { logger } = require('./errorHandler');
const { AuthenticationError, AuthorizationError } = require('./errorHandler');

class AuthManager {
  constructor() {
    this.accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY || '15m';
    this.refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY || '7d';
    this.tokenBlacklist = new Set();
    this.refreshTokenStore = new Map();
  }

  // ========================================================================
  // PASSWORD MANAGEMENT
  // ========================================================================

  async hashPassword(password) {
    try {
      const salt = await bcrypt.genSalt(12);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      logger.error('Password hashing failed', { error: error.message });
      throw error;
    }
  }

  async comparePassword(password, hash) {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      logger.error('Password comparison failed', { error: error.message });
      throw error;
    }
  }

  // ========================================================================
  // TOKEN GENERATION
  // ========================================================================

  generateAccessToken(userId, role = 'customer') {
    try {
      const payload = {
        userId,
        role,
        type: 'access',
        iat: Math.floor(Date.now() / 1000)
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: this.accessTokenExpiry,
        issuer: 'trendaryo',
        audience: 'trendaryo-client'
      });

      logger.debug('Access token generated', { userId });
      return token;
    } catch (error) {
      logger.error('Access token generation failed', { error: error.message });
      throw error;
    }
  }

  generateRefreshToken(userId) {
    try {
      const tokenId = uuidv4();
      const payload = {
        userId,
        tokenId,
        type: 'refresh',
        iat: Math.floor(Date.now() / 1000)
      };

      const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret', {
        expiresIn: this.refreshTokenExpiry,
        issuer: 'trendaryo'
      });

      // Store refresh token for revocation
      this.refreshTokenStore.set(tokenId, {
        userId,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

      logger.debug('Refresh token generated', { userId, tokenId });
      return token;
    } catch (error) {
      logger.error('Refresh token generation failed', { error: error.message });
      throw error;
    }
  }

  generateTokenPair(userId, role = 'customer') {
    return {
      accessToken: this.generateAccessToken(userId, role),
      refreshToken: this.generateRefreshToken(userId),
      expiresIn: this.accessTokenExpiry
    };
  }

  // ========================================================================
  // TOKEN VERIFICATION
  // ========================================================================

  verifyAccessToken(token) {
    try {
      if (this.tokenBlacklist.has(token)) {
        throw new AuthenticationError('Token has been revoked');
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', {
        issuer: 'trendaryo',
        audience: 'trendaryo-client'
      });

      if (decoded.type !== 'access') {
        throw new AuthenticationError('Invalid token type');
      }

      logger.debug('Access token verified', { userId: decoded.userId });
      return decoded;
    } catch (error) {
      if (error instanceof AuthenticationError) throw error;
      logger.warn('Access token verification failed', { error: error.message });
      throw new AuthenticationError('Invalid or expired token');
    }
  }

  verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret', {
        issuer: 'trendaryo'
      });

      if (decoded.type !== 'refresh') {
        throw new AuthenticationError('Invalid token type');
      }

      // Check if token is in store and not revoked
      const tokenData = this.refreshTokenStore.get(decoded.tokenId);
      if (!tokenData) {
        throw new AuthenticationError('Refresh token not found or revoked');
      }

      if (new Date() > tokenData.expiresAt) {
        this.refreshTokenStore.delete(decoded.tokenId);
        throw new AuthenticationError('Refresh token expired');
      }

      logger.debug('Refresh token verified', { userId: decoded.userId });
      return decoded;
    } catch (error) {
      if (error instanceof AuthenticationError) throw error;
      logger.warn('Refresh token verification failed', { error: error.message });
      throw new AuthenticationError('Invalid or expired refresh token');
    }
  }

  // ========================================================================
  // TOKEN REFRESH
  // ========================================================================

  refreshAccessToken(refreshToken) {
    try {
      const decoded = this.verifyRefreshToken(refreshToken);
      const newAccessToken = this.generateAccessToken(decoded.userId);
      
      logger.info('Access token refreshed', { userId: decoded.userId });
      return {
        accessToken: newAccessToken,
        expiresIn: this.accessTokenExpiry
      };
    } catch (error) {
      logger.error('Token refresh failed', { error: error.message });
      throw error;
    }
  }

  // ========================================================================
  // TOKEN REVOCATION
  // ========================================================================

  revokeAccessToken(token) {
    try {
      const decoded = this.verifyAccessToken(token);
      this.tokenBlacklist.add(token);
      
      // Auto-cleanup after expiry
      const expiryTime = (decoded.exp - decoded.iat) * 1000;
      setTimeout(() => this.tokenBlacklist.delete(token), expiryTime);
      
      logger.info('Access token revoked', { userId: decoded.userId });
      return true;
    } catch (error) {
      logger.error('Token revocation failed', { error: error.message });
      throw error;
    }
  }

  revokeRefreshToken(token) {
    try {
      const decoded = this.verifyRefreshToken(token);
      this.refreshTokenStore.delete(decoded.tokenId);
      
      logger.info('Refresh token revoked', { userId: decoded.userId });
      return true;
    } catch (error) {
      logger.error('Refresh token revocation failed', { error: error.message });
      throw error;
    }
  }

  revokeAllUserTokens(userId) {
    try {
      let revokedCount = 0;
      
      // Revoke all refresh tokens for user
      for (const [tokenId, data] of this.refreshTokenStore.entries()) {
        if (data.userId === userId) {
          this.refreshTokenStore.delete(tokenId);
          revokedCount++;
        }
      }
      
      logger.info('All user tokens revoked', { userId, count: revokedCount });
      return revokedCount;
    } catch (error) {
      logger.error('Revoke all tokens failed', { error: error.message });
      throw error;
    }
  }

  // ========================================================================
  // MIDDLEWARE
  // ========================================================================

  authenticate() {
    return (req, res, next) => {
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          throw new AuthenticationError('Missing or invalid authorization header');
        }

        const token = authHeader.substring(7);
        const decoded = this.verifyAccessToken(token);
        
        req.user = {
          userId: decoded.userId,
          role: decoded.role
        };
        
        next();
      } catch (error) {
        next(error);
      }
    };
  }

  authorize(...allowedRoles) {
    return (req, res, next) => {
      try {
        if (!req.user) {
          throw new AuthenticationError('User not authenticated');
        }

        if (!allowedRoles.includes(req.user.role)) {
          throw new AuthorizationError('Insufficient permissions');
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  // ========================================================================
  // CLEANUP
  // ========================================================================

  cleanupExpiredTokens() {
    const now = new Date();
    let cleanedCount = 0;

    for (const [tokenId, data] of this.refreshTokenStore.entries()) {
      if (now > data.expiresAt) {
        this.refreshTokenStore.delete(tokenId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      logger.info('Expired tokens cleaned up', { count: cleanedCount });
    }

    return cleanedCount;
  }

  startCleanupInterval(interval = 3600000) { // 1 hour
    setInterval(() => this.cleanupExpiredTokens(), interval);
    logger.info('Token cleanup interval started', { interval });
  }

  getTokenStats() {
    return {
      blacklistedTokens: this.tokenBlacklist.size,
      activeRefreshTokens: this.refreshTokenStore.size
    };
  }
}

module.exports = AuthManager;
