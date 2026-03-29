/**
 * VALIDATION & SANITIZATION UTILITIES
 * Comprehensive input validation and data sanitization
 */

const Joi = require('joi');
const { ValidationError } = require('./errorHandler');

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const schemas = {
  // User schemas
  userRegister: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Invalid email format',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(8).required().messages({
      'string.min': 'Password must be at least 8 characters',
      'any.required': 'Password is required'
    }),
    firstName: Joi.string().max(50).required(),
    lastName: Joi.string().max(50).required(),
    phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).required()
  }),

  userLogin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  userUpdate: Joi.object({
    firstName: Joi.string().max(50),
    lastName: Joi.string().max(50),
    phone: Joi.string().pattern(/^[0-9+\-\s()]+$/),
    email: Joi.string().email()
  }),

  // Product schemas
  productCreate: Joi.object({
    name: Joi.string().max(200).required(),
    description: Joi.string().max(2000),
    price: Joi.number().positive().required(),
    oldPrice: Joi.number().positive(),
    emoji: Joi.string().max(10),
    badge: Joi.string().valid('hot', 'trending', 'premium'),
    stock: Joi.number().integer().min(0)
  }),

  productUpdate: Joi.object({
    name: Joi.string().max(200),
    description: Joi.string().max(2000),
    price: Joi.number().positive(),
    oldPrice: Joi.number().positive(),
    emoji: Joi.string().max(10),
    badge: Joi.string().valid('hot', 'trending', 'premium'),
    stock: Joi.number().integer().min(0)
  }),

  // Order schemas
  orderCreate: Joi.object({
    items: Joi.array().items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required()
      })
    ).required(),
    shippingAddress: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zip: Joi.string().required(),
      country: Joi.string().required()
    }).required(),
    paymentMethod: Joi.string().valid('card', 'paypal', 'cod').required()
  }),

  // Review schemas
  reviewCreate: Joi.object({
    productId: Joi.string().required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    title: Joi.string().max(200),
    comment: Joi.string().max(2000).required()
  }),

  // Payment schemas
  paymentProcess: Joi.object({
    orderId: Joi.string().required(),
    amount: Joi.number().positive().required(),
    currency: Joi.string().length(3).required(),
    paymentMethod: Joi.string().required(),
    token: Joi.string()
  })
};

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

const validate = async (data, schema) => {
  try {
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.reduce((acc, err) => {
        acc[err.path.join('.')] = err.message;
        return acc;
      }, {});
      throw new ValidationError('Validation failed', details);
    }

    return value;
  } catch (err) {
    if (err instanceof ValidationError) throw err;
    throw new ValidationError('Validation error', { error: err.message });
  }
};

// ============================================================================
// SANITIZATION FUNCTIONS
// ============================================================================

const sanitize = {
  string: (value) => {
    if (typeof value !== 'string') return '';
    return value.trim().replace(/[<>]/g, '');
  },

  email: (value) => {
    return sanitize.string(value).toLowerCase();
  },

  number: (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  },

  integer: (value) => {
    return Math.floor(sanitize.number(value));
  },

  boolean: (value) => {
    return value === true || value === 'true' || value === 1 || value === '1';
  },

  object: (obj) => {
    if (typeof obj !== 'object' || obj === null) return {};
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = sanitize.string(value);
      } else if (typeof value === 'number') {
        sanitized[key] = sanitize.number(value);
      } else if (typeof value === 'boolean') {
        sanitized[key] = sanitize.boolean(value);
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map(v => typeof v === 'string' ? sanitize.string(v) : v);
      } else if (typeof value === 'object') {
        sanitized[key] = sanitize.object(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  },

  array: (arr) => {
    if (!Array.isArray(arr)) return [];
    return arr.map(item => typeof item === 'string' ? sanitize.string(item) : item);
  }
};

// ============================================================================
// VALIDATION MIDDLEWARE
// ============================================================================

const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      const data = req.body || {};
      req.validatedData = await validate(data, schema);
      next();
    } catch (error) {
      next(error);
    }
  };
};

const validateQuery = (schema) => {
  return async (req, res, next) => {
    try {
      const data = req.query || {};
      req.validatedQuery = await validate(data, schema);
      next();
    } catch (error) {
      next(error);
    }
  };
};

// ============================================================================
// BUSINESS LOGIC VALIDATORS
// ============================================================================

const businessValidators = {
  async validateProductStock(db, productId, quantity) {
    const product = await db.get('SELECT stock FROM products WHERE id = ?', [productId]);
    if (!product) {
      throw new ValidationError('Product not found');
    }
    if (product.stock < quantity) {
      throw new ValidationError('Insufficient stock', { available: product.stock, requested: quantity });
    }
    return true;
  },

  async validateUserExists(db, userId) {
    const user = await db.get('SELECT id FROM users WHERE id = ?', [userId]);
    if (!user) {
      throw new ValidationError('User not found');
    }
    return true;
  },

  async validateOrderBelongsToUser(db, orderId, userId) {
    const order = await db.get('SELECT userId FROM orders WHERE id = ?', [orderId]);
    if (!order) {
      throw new ValidationError('Order not found');
    }
    if (order.userId !== userId) {
      throw new ValidationError('Unauthorized access to order');
    }
    return true;
  },

  async validateUniqueEmail(db, email, excludeUserId = null) {
    const query = excludeUserId 
      ? 'SELECT id FROM users WHERE email = ? AND id != ?'
      : 'SELECT id FROM users WHERE email = ?';
    const params = excludeUserId ? [email, excludeUserId] : [email];
    
    const user = await db.get(query, params);
    if (user) {
      throw new ValidationError('Email already in use');
    }
    return true;
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  schemas,
  validate,
  sanitize,
  validateRequest,
  validateQuery,
  businessValidators
};
