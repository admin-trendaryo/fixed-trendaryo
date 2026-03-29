/**
 * ADMIN ROUTES
 * System statistics and error monitoring
 */

const { logger } = require('../utils/errorHandler');

// ============================================================================
// GET SYSTEM STATISTICS
// ============================================================================

const getStats = async (req, res, next) => {
  try {
    const db = req.app.locals.db;

    // Get user count
    const userStats = await db.get('SELECT COUNT(*) as total FROM users WHERE status = ?', ['active']);

    // Get product count
    const productStats = await db.get('SELECT COUNT(*) as total FROM products WHERE status = ?', ['active']);

    // Get order stats
    const orderStats = await db.get(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(total) as revenue
       FROM orders`
    );

    // Get payment stats
    const paymentStats = await db.get(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as successful,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
       FROM payments`
    );

    // Get recent orders
    const recentOrders = await db.all(
      `SELECT id, userId, total, status, createdAt FROM orders ORDER BY createdAt DESC LIMIT 10`
    );

    logger.debug('Admin stats retrieved');

    res.json({
      success: true,
      data: {
        users: userStats,
        products: productStats,
        orders: orderStats,
        payments: paymentStats,
        recentOrders
      }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// GET ERROR LOGS
// ============================================================================

const getErrors = async (req, res, next) => {
  try {
    const { recoveryManager } = require('../utils/errorHandler');
    const { limit = 50 } = req.query;

    const errorHistory = recoveryManager.getErrorHistory();
    const errorStats = recoveryManager.getErrorStats();

    // Get last N errors
    const recentErrors = errorHistory.slice(-parseInt(limit));

    logger.debug('Error logs retrieved');

    res.json({
      success: true,
      data: {
        stats: errorStats,
        recentErrors,
        totalErrors: errorHistory.length
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getErrors
};
