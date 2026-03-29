/**
 * USER ROUTES
 * Get and update user profile
 */

const { logger } = require('../utils/errorHandler');
const { NotFoundError } = require('../utils/errorHandler');
const { validate, sanitize, schemas, businessValidators } = require('../utils/validation');

// ============================================================================
// GET PROFILE
// ============================================================================

const getProfile = async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user.userId;

    const user = await db.get(
      `SELECT id, email, firstName, lastName, phone, role, status, createdAt FROM users WHERE id = ?`,
      [userId]
    );

    if (!user) {
      throw new NotFoundError('User');
    }

    logger.debug('User profile retrieved', { userId });

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// UPDATE PROFILE
// ============================================================================

const updateProfile = async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user.userId;

    // Validate input
    const data = await validate(req.body, schemas.userUpdate);

    // Sanitize data
    const sanitized = {};
    if (data.firstName) sanitized.firstName = sanitize.string(data.firstName);
    if (data.lastName) sanitized.lastName = sanitize.string(data.lastName);
    if (data.phone) sanitized.phone = sanitize.string(data.phone);
    if (data.email) {
      sanitized.email = sanitize.email(data.email);
      // Check if email is unique (excluding current user)
      await businessValidators.validateUniqueEmail(db, sanitized.email, userId);
    }

    // Build update query
    const updates = Object.keys(sanitized).map(key => `${key} = ?`).join(', ');
    const values = Object.values(sanitized);
    values.push(userId);

    await db.run(
      `UPDATE users SET ${updates}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );

    logger.info('User profile updated', { userId });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: sanitized
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile
};
