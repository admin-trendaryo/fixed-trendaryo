/**
 * PAYMENT ROUTES
 * Process payments with Stripe integration
 */

const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');
const { logger } = require('../utils/errorHandler');
const { NotFoundError, ValidationError, PaymentError } = require('../utils/errorHandler');
const { validate, schemas, businessValidators } = require('../utils/validation');

// ============================================================================
// PROCESS PAYMENT
// ============================================================================

const process = async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user.userId;

    // Validate input
    const data = await validate(req.body, schemas.paymentProcess);

    // Verify order exists and belongs to user
    const order = await db.get(
      `SELECT * FROM orders WHERE id = ? AND userId = ?`,
      [data.orderId, userId]
    );

    if (!order) {
      throw new NotFoundError('Order');
    }

    if (order.paymentStatus === 'completed') {
      throw new ValidationError('Payment already processed for this order');
    }

    // Create payment record
    const paymentId = uuidv4();
    await db.run(
      `INSERT INTO payments (id, orderId, amount, currency, status, method)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [paymentId, data.orderId, data.amount, data.currency, 'processing', data.paymentMethod]
    );

    try {
      // Process payment based on method
      let paymentResult;

      if (data.paymentMethod === 'card') {
        paymentResult = await processCardPayment(data, paymentId, db);
      } else if (data.paymentMethod === 'paypal') {
        paymentResult = await processPayPalPayment(data, paymentId, db);
      } else if (data.paymentMethod === 'cod') {
        paymentResult = await processCODPayment(data, paymentId, db);
      } else {
        throw new ValidationError('Invalid payment method');
      }

      // Update payment status
      await db.run(
        `UPDATE payments SET status = ?, transactionId = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
        [paymentResult.status, paymentResult.transactionId, paymentId]
      );

      // Update order payment status
      await db.run(
        `UPDATE orders SET paymentStatus = ?, status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
        [paymentResult.status, paymentResult.status === 'completed' ? 'confirmed' : 'pending', data.orderId]
      );

      logger.info('Payment processed', { paymentId, orderId: data.orderId, status: paymentResult.status });

      res.json({
        success: true,
        message: 'Payment processed successfully',
        data: {
          paymentId,
          orderId: data.orderId,
          status: paymentResult.status,
          transactionId: paymentResult.transactionId
        }
      });
    } catch (paymentError) {
      // Update payment with error
      await db.run(
        `UPDATE payments SET status = ?, errorMessage = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
        ['failed', paymentError.message, paymentId]
      );

      logger.error('Payment processing failed', { paymentId, error: paymentError.message });
      throw new PaymentError('Payment processing failed', { error: paymentError.message });
    }
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// PAYMENT PROCESSORS
// ============================================================================

async function processCardPayment(data, paymentId, db) {
  try {
    if (!data.token) {
      throw new Error('Payment token required');
    }

    // Create Stripe charge
    const charge = await stripe.charges.create({
      amount: Math.round(data.amount * 100), // Convert to cents
      currency: data.currency.toLowerCase(),
      source: data.token,
      description: `Order payment - ${data.orderId}`,
      metadata: {
        paymentId,
        orderId: data.orderId
      }
    });

    return {
      status: 'completed',
      transactionId: charge.id
    };
  } catch (error) {
    logger.error('Card payment failed', { error: error.message });
    throw error;
  }
}

async function processPayPalPayment(data, paymentId, db) {
  try {
    // Simulate PayPal payment processing
    // In production, integrate with PayPal API
    logger.info('PayPal payment initiated', { paymentId });

    return {
      status: 'pending', // PayPal requires additional verification
      transactionId: `PAYPAL_${paymentId}`
    };
  } catch (error) {
    logger.error('PayPal payment failed', { error: error.message });
    throw error;
  }
}

async function processCODPayment(data, paymentId, db) {
  try {
    // Cash on Delivery - mark as pending
    logger.info('COD payment initiated', { paymentId });

    return {
      status: 'pending',
      transactionId: `COD_${paymentId}`
    };
  } catch (error) {
    logger.error('COD payment failed', { error: error.message });
    throw error;
  }
}

// ============================================================================
// GET PAYMENT BY ID
// ============================================================================

const getById = async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user.userId;
    const { id } = req.params;

    // Verify payment belongs to user's order
    const payment = await db.get(
      `SELECT p.* FROM payments p
       JOIN orders o ON p.orderId = o.id
       WHERE p.id = ? AND o.userId = ?`,
      [id, userId]
    );

    if (!payment) {
      throw new NotFoundError('Payment');
    }

    logger.debug('Payment retrieved', { paymentId: id });

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  process,
  getById
};
