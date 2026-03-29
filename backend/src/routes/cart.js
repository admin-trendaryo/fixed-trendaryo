/**
 * CART ROUTES
 * Add, retrieve, and remove items from cart
 */

const { v4: uuidv4 } = require('uuid');
const { logger } = require('../utils/errorHandler');
const { NotFoundError, ValidationError } = require('../utils/errorHandler');
const { businessValidators } = require('../utils/validation');

// ============================================================================
// ADD TO CART
// ============================================================================

const add = async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      throw new ValidationError('Product ID and quantity are required');
    }

    // Validate product exists and has stock
    await businessValidators.validateProductStock(db, productId, quantity);

    // Check if item already in cart
    const existing = await db.get(
      `SELECT id, quantity FROM cart WHERE userId = ? AND productId = ?`,
      [userId, productId]
    );

    if (existing) {
      // Update quantity
      await db.run(
        `UPDATE cart SET quantity = quantity + ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
        [quantity, existing.id]
      );
      logger.debug('Cart item updated', { userId, productId, quantity });
    } else {
      // Add new item
      const cartId = uuidv4();
      await db.run(
        `INSERT INTO cart (id, userId, productId, quantity) VALUES (?, ?, ?, ?)`,
        [cartId, userId, productId, quantity]
      );
      logger.debug('Item added to cart', { userId, productId, quantity });
    }

    res.json({
      success: true,
      message: 'Item added to cart'
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// GET CART
// ============================================================================

const get = async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user.userId;

    const cartItems = await db.all(
      `SELECT c.id, c.productId, c.quantity, p.name, p.price, p.emoji
       FROM cart c
       JOIN products p ON c.productId = p.id
       WHERE c.userId = ?`,
      [userId]
    );

    let subtotal = 0;
    cartItems.forEach(item => {
      subtotal += item.price * item.quantity;
    });

    const shipping = subtotal >= 50 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    logger.debug('Cart retrieved', { userId, itemCount: cartItems.length });

    res.json({
      success: true,
      data: {
        items: cartItems,
        totals: {
          subtotal,
          shipping,
          tax,
          total
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// REMOVE FROM CART
// ============================================================================

const remove = async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user.userId;
    const { productId } = req.params;

    const result = await db.run(
      `DELETE FROM cart WHERE userId = ? AND productId = ?`,
      [userId, productId]
    );

    if (result.changes === 0) {
      throw new NotFoundError('Cart item');
    }

    logger.debug('Item removed from cart', { userId, productId });

    res.json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  add,
  get,
  remove
};
