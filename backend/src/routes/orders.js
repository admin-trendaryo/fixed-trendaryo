/**
 * ORDER ROUTES
 * Create, retrieve, and manage orders
 */

const { v4: uuidv4 } = require('uuid');
const { logger } = require('../utils/errorHandler');
const { NotFoundError, ValidationError } = require('../utils/errorHandler');
const { validate, sanitize, schemas, businessValidators } = require('../utils/validation');

// ============================================================================
// CREATE ORDER
// ============================================================================

const create = async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user.userId;

    // Validate input
    const data = await validate(req.body, schemas.orderCreate);

    // Validate all products exist and have sufficient stock
    let subtotal = 0;
    const orderItems = [];

    for (const item of data.items) {
      await businessValidators.validateProductStock(db, item.productId, item.quantity);
      
      const product = await db.get('SELECT price FROM products WHERE id = ?', [item.productId]);
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price
      });
    }

    // Calculate totals
    const shipping = subtotal >= 50 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    // Create order
    const orderId = uuidv4();
    await db.run(
      `INSERT INTO orders (id, userId, status, subtotal, shipping, tax, total, paymentMethod, shippingAddress)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [orderId, userId, 'pending', subtotal, shipping, tax, total, data.paymentMethod, JSON.stringify(data.shippingAddress)]
    );

    // Create order items
    for (const item of orderItems) {
      const itemId = uuidv4();
      await db.run(
        `INSERT INTO orderItems (id, orderId, productId, quantity, price)
         VALUES (?, ?, ?, ?, ?)`,
        [itemId, orderId, item.productId, item.quantity, item.price]
      );

      // Update product stock
      await db.run(
        `UPDATE products SET stock = stock - ? WHERE id = ?`,
        [item.quantity, item.productId]
      );
    }

    logger.info('Order created', { orderId, userId, total });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId,
        status: 'pending',
        subtotal,
        shipping,
        tax,
        total,
        items: orderItems
      }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// GET ALL ORDERS
// ============================================================================

const getAll = async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user.userId;
    const { page = 1, limit = 20 } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const orders = await db.all(
      `SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
      [userId, parseInt(limit), offset]
    );

    const countResult = await db.get(
      `SELECT COUNT(*) as total FROM orders WHERE userId = ?`,
      [userId]
    );

    logger.debug('Orders retrieved', { userId, count: orders.length });

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult.total,
        pages: Math.ceil(countResult.total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// GET ORDER BY ID
// ============================================================================

const getById = async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user.userId;
    const { id } = req.params;

    // Verify order belongs to user
    await businessValidators.validateOrderBelongsToUser(db, id, userId);

    const order = await db.get(
      `SELECT * FROM orders WHERE id = ?`,
      [id]
    );

    const items = await db.all(
      `SELECT * FROM orderItems WHERE orderId = ?`,
      [id]
    );

    logger.debug('Order retrieved', { orderId: id, userId });

    res.json({
      success: true,
      data: {
        ...order,
        items
      }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// UPDATE ORDER
// ============================================================================

const update = async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user.userId;
    const { id } = req.params;
    const { status } = req.body;

    // Verify order belongs to user
    await businessValidators.validateOrderBelongsToUser(db, id, userId);

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new ValidationError('Invalid order status', { validStatuses });
    }

    await db.run(
      `UPDATE orders SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
      [status, id]
    );

    logger.info('Order updated', { orderId: id, status });

    res.json({
      success: true,
      message: 'Order updated successfully',
      data: { id, status }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update
};
