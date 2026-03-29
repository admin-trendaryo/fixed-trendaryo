/**
 * PRODUCT ROUTES
 * Get, create, update, and delete products
 */

const { v4: uuidv4 } = require('uuid');
const { logger } = require('../utils/errorHandler');
const { NotFoundError, ValidationError } = require('../utils/errorHandler');
const { validate, sanitize, schemas } = require('../utils/validation');

// ============================================================================
// GET ALL PRODUCTS
// ============================================================================

const getAll = async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const { page = 1, limit = 20, status = 'active' } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const products = await db.all(
      `SELECT * FROM products WHERE status = ? ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
      [status, parseInt(limit), offset]
    );

    const countResult = await db.get(
      `SELECT COUNT(*) as total FROM products WHERE status = ?`,
      [status]
    );

    logger.debug('Products retrieved', { count: products.length, page, limit });

    res.json({
      success: true,
      data: products,
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
// GET PRODUCT BY ID
// ============================================================================

const getById = async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;

    const product = await db.get(
      `SELECT * FROM products WHERE id = ?`,
      [id]
    );

    if (!product) {
      throw new NotFoundError('Product');
    }

    logger.debug('Product retrieved', { productId: id });

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// CREATE PRODUCT
// ============================================================================

const create = async (req, res, next) => {
  try {
    const db = req.app.locals.db;

    // Validate input
    const data = await validate(req.body, schemas.productCreate);

    // Sanitize data
    const sanitized = {
      name: sanitize.string(data.name),
      description: sanitize.string(data.description || ''),
      price: sanitize.number(data.price),
      oldPrice: sanitize.number(data.oldPrice || 0),
      emoji: sanitize.string(data.emoji || ''),
      badge: sanitize.string(data.badge || ''),
      stock: sanitize.integer(data.stock || 0)
    };

    // Create product
    const productId = uuidv4();
    await db.run(
      `INSERT INTO products (id, name, description, price, oldPrice, emoji, badge, stock, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [productId, sanitized.name, sanitized.description, sanitized.price, sanitized.oldPrice, sanitized.emoji, sanitized.badge, sanitized.stock, 'active']
    );

    logger.info('Product created', { productId, name: sanitized.name });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { id: productId, ...sanitized }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// UPDATE PRODUCT
// ============================================================================

const update = async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;

    // Check if product exists
    const product = await db.get('SELECT id FROM products WHERE id = ?', [id]);
    if (!product) {
      throw new NotFoundError('Product');
    }

    // Validate input
    const data = await validate(req.body, schemas.productUpdate);

    // Sanitize data
    const sanitized = {};
    if (data.name) sanitized.name = sanitize.string(data.name);
    if (data.description) sanitized.description = sanitize.string(data.description);
    if (data.price) sanitized.price = sanitize.number(data.price);
    if (data.oldPrice) sanitized.oldPrice = sanitize.number(data.oldPrice);
    if (data.emoji) sanitized.emoji = sanitize.string(data.emoji);
    if (data.badge) sanitized.badge = sanitize.string(data.badge);
    if (data.stock !== undefined) sanitized.stock = sanitize.integer(data.stock);

    // Build update query
    const updates = Object.keys(sanitized).map(key => `${key} = ?`).join(', ');
    const values = Object.values(sanitized);
    values.push(id);

    await db.run(
      `UPDATE products SET ${updates}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );

    logger.info('Product updated', { productId: id });

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { id, ...sanitized }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// DELETE PRODUCT
// ============================================================================

const deleteProduct = async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;

    // Check if product exists
    const product = await db.get('SELECT id FROM products WHERE id = ?', [id]);
    if (!product) {
      throw new NotFoundError('Product');
    }

    // Soft delete
    await db.run(
      `UPDATE products SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
      ['deleted', id]
    );

    logger.info('Product deleted', { productId: id });

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteProduct
};
