/**
 * EMAIL NOTIFICATION SYSTEM
 * Handles order confirmations, shipping updates, and promotional emails
 */

class EmailManager {
  constructor() {
    this.API_BASE = 'http://localhost:3000';
    this.EMAIL_TEMPLATES = {
      ORDER_CONFIRMATION: 'order_confirmation',
      SHIPPING_NOTIFICATION: 'shipping_notification',
      DELIVERY_CONFIRMATION: 'delivery_confirmation',
      REVIEW_REQUEST: 'review_request',
      PROMOTIONAL: 'promotional',
      PASSWORD_RESET: 'password_reset',
      WELCOME: 'welcome'
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ORDER CONFIRMATION EMAIL
  // ═══════════════════════════════════════════════════════════════════════════

  async sendOrderConfirmation(orderId, orderData) {
    try {
      const token = localStorage.getItem('trendaryo_access_token');
      if (!token) throw new Error('User not authenticated');

      const response = await fetch(`${this.API_BASE}/api/emails/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          template: this.EMAIL_TEMPLATES.ORDER_CONFIRMATION,
          orderId: orderId,
          recipientEmail: orderData.email,
          recipientName: orderData.firstName,
          data: {
            orderNumber: orderId.substring(0, 8).toUpperCase(),
            orderDate: new Date().toLocaleDateString(),
            items: orderData.items,
            subtotal: orderData.subtotal,
            shipping: orderData.shipping,
            tax: orderData.tax,
            total: orderData.total,
            shippingAddress: orderData.shippingAddress,
            estimatedDelivery: this.calculateEstimatedDelivery(orderData.shippingMethod)
          }
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Failed to send email');

      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SHIPPING NOTIFICATION EMAIL
  // ═══════════════════════════════════════════════════════════════════════════

  async sendShippingNotification(orderId, trackingData) {
    try {
      const token = localStorage.getItem('trendaryo_access_token');
      if (!token) throw new Error('User not authenticated');

      const response = await fetch(`${this.API_BASE}/api/emails/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          template: this.EMAIL_TEMPLATES.SHIPPING_NOTIFICATION,
          orderId: orderId,
          recipientEmail: trackingData.email,
          recipientName: trackingData.firstName,
          data: {
            orderNumber: orderId.substring(0, 8).toUpperCase(),
            trackingNumber: trackingData.trackingNumber,
            carrier: trackingData.carrier,
            carrierUrl: this.getCarrierTrackingUrl(trackingData.carrier, trackingData.trackingNumber),
            shippedDate: new Date().toLocaleDateString(),
            estimatedDelivery: trackingData.estimatedDelivery,
            shippingAddress: trackingData.shippingAddress
          }
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Failed to send email');

      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DELIVERY CONFIRMATION EMAIL
  // ═══════════════════════════════════════════════════════════════════════════

  async sendDeliveryConfirmation(orderId, deliveryData) {
    try {
      const token = localStorage.getItem('trendaryo_access_token');
      if (!token) throw new Error('User not authenticated');

      const response = await fetch(`${this.API_BASE}/api/emails/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          template: this.EMAIL_TEMPLATES.DELIVERY_CONFIRMATION,
          orderId: orderId,
          recipientEmail: deliveryData.email,
          recipientName: deliveryData.firstName,
          data: {
            orderNumber: orderId.substring(0, 8).toUpperCase(),
            deliveredDate: new Date().toLocaleDateString(),
            items: deliveryData.items,
            total: deliveryData.total,
            reviewUrl: `${window.location.origin}/product.html?review=${orderId}`
          }
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Failed to send email');

      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // REVIEW REQUEST EMAIL
  // ═══════════════════════════════════════════════════════════════════════════

  async sendReviewRequest(orderId, reviewData) {
    try {
      const token = localStorage.getItem('trendaryo_access_token');
      if (!token) throw new Error('User not authenticated');

      const response = await fetch(`${this.API_BASE}/api/emails/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          template: this.EMAIL_TEMPLATES.REVIEW_REQUEST,
          orderId: orderId,
          recipientEmail: reviewData.email,
          recipientName: reviewData.firstName,
          data: {
            orderNumber: orderId.substring(0, 8).toUpperCase(),
            items: reviewData.items,
            reviewUrl: `${window.location.origin}/product.html?review=${orderId}`,
            daysAgo: reviewData.daysAgo || 3
          }
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Failed to send email');

      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PROMOTIONAL EMAIL
  // ═══════════════════════════════════════════════════════════════════════════

  async sendPromotionalEmail(recipientEmail, recipientName, promotionData) {
    try {
      const token = localStorage.getItem('trendaryo_access_token');
      if (!token) throw new Error('User not authenticated');

      const response = await fetch(`${this.API_BASE}/api/emails/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          template: this.EMAIL_TEMPLATES.PROMOTIONAL,
          recipientEmail: recipientEmail,
          recipientName: recipientName,
          data: {
            title: promotionData.title,
            description: promotionData.description,
            discount: promotionData.discount,
            code: promotionData.code,
            expiryDate: promotionData.expiryDate,
            shopUrl: `${window.location.origin}/shop.html?promo=${promotionData.code}`,
            products: promotionData.products || []
          }
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Failed to send email');

      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // WELCOME EMAIL
  // ═══════════════════════════════════════════════════════════════════════════

  async sendWelcomeEmail(recipientEmail, recipientName, userData) {
    try {
      const response = await fetch(`${this.API_BASE}/api/emails/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          template: this.EMAIL_TEMPLATES.WELCOME,
          recipientEmail: recipientEmail,
          recipientName: recipientName,
          data: {
            firstName: userData.firstName,
            welcomeDiscount: '20%',
            code: 'WELCOME20',
            shopUrl: `${window.location.origin}/shop.html?promo=WELCOME20`,
            accountUrl: `${window.location.origin}/account.html`
          }
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Failed to send email');

      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PASSWORD RESET EMAIL
  // ═══════════════════════════════════════════════════════════════════════════

  async sendPasswordResetEmail(recipientEmail, resetToken) {
    try {
      const response = await fetch(`${this.API_BASE}/api/emails/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          template: this.EMAIL_TEMPLATES.PASSWORD_RESET,
          recipientEmail: recipientEmail,
          data: {
            resetUrl: `${window.location.origin}/reset-password.html?token=${resetToken}`,
            expiryTime: '1 hour'
          }
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Failed to send email');

      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // EMAIL SUBSCRIPTION MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  async subscribeToEmails(email, preferences = {}) {
    try {
      const response = await fetch(`${this.API_BASE}/api/emails/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          preferences: {
            orderUpdates: preferences.orderUpdates !== false,
            promotions: preferences.promotions !== false,
            newsletter: preferences.newsletter !== false,
            reviews: preferences.reviews !== false,
            ...preferences
          }
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Failed to subscribe');

      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async unsubscribeFromEmails(email) {
    try {
      const response = await fetch(`${this.API_BASE}/api/emails/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Failed to unsubscribe');

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateEmailPreferences(email, preferences) {
    try {
      const token = localStorage.getItem('trendaryo_access_token');
      if (!token) throw new Error('User not authenticated');

      const response = await fetch(`${this.API_BASE}/api/emails/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: email,
          preferences: preferences
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Failed to update preferences');

      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getEmailPreferences(email) {
    try {
      const token = localStorage.getItem('trendaryo_access_token');
      if (!token) throw new Error('User not authenticated');

      const response = await fetch(`${this.API_BASE}/api/emails/preferences?email=${email}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Failed to fetch preferences');

      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // EMAIL HISTORY
  // ═══════════════════════════════════════════════════════════════════════════

  async getEmailHistory(limit = 20, offset = 0) {
    try {
      const token = localStorage.getItem('trendaryo_access_token');
      if (!token) throw new Error('User not authenticated');

      const response = await fetch(
        `${this.API_BASE}/api/emails/history?limit=${limit}&offset=${offset}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Failed to fetch history');

      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // BULK EMAIL OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  async sendBulkPromotionalEmail(recipients, promotionData) {
    try {
      const token = localStorage.getItem('trendaryo_access_token');
      if (!token) throw new Error('User not authenticated');

      const response = await fetch(`${this.API_BASE}/api/emails/bulk-send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          template: this.EMAIL_TEMPLATES.PROMOTIONAL,
          recipients: recipients,
          data: promotionData
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Failed to send bulk email');

      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // UTILITY FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  calculateEstimatedDelivery(shippingMethod) {
    const date = new Date();
    const days = shippingMethod === 'express' ? 3 : 7;
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString();
  }

  getCarrierTrackingUrl(carrier, trackingNumber) {
    const carriers = {
      'UPS': `https://www.ups.com/track?tracknum=${trackingNumber}`,
      'FedEx': `https://tracking.fedex.com/en/tracking/${trackingNumber}`,
      'USPS': `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
      'DHL': `https://www.dhl.com/en/en/express/tracking.html?AWB=${trackingNumber}`
    };
    return carriers[carrier] || '#';
  }

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  formatEmailAddress(name, email) {
    return `${name} <${email}>`;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // EMAIL TEMPLATES
  // ═══════════════════════════════════════════════════════════════════════════

  getEmailTemplate(templateName) {
    const templates = {
      [this.EMAIL_TEMPLATES.ORDER_CONFIRMATION]: {
        subject: 'Order Confirmation - Trendaryo',
        preview: 'Your order has been confirmed'
      },
      [this.EMAIL_TEMPLATES.SHIPPING_NOTIFICATION]: {
        subject: 'Your Order is on the Way - Trendaryo',
        preview: 'Your order has been shipped'
      },
      [this.EMAIL_TEMPLATES.DELIVERY_CONFIRMATION]: {
        subject: 'Your Order Has Been Delivered - Trendaryo',
        preview: 'Your order has been delivered'
      },
      [this.EMAIL_TEMPLATES.REVIEW_REQUEST]: {
        subject: 'Share Your Experience - Trendaryo',
        preview: 'We would love to hear from you'
      },
      [this.EMAIL_TEMPLATES.PROMOTIONAL]: {
        subject: 'Special Offer Just for You - Trendaryo',
        preview: 'Check out our latest deals'
      },
      [this.EMAIL_TEMPLATES.WELCOME]: {
        subject: 'Welcome to Trendaryo!',
        preview: 'Get 20% off your first order'
      },
      [this.EMAIL_TEMPLATES.PASSWORD_RESET]: {
        subject: 'Reset Your Password - Trendaryo',
        preview: 'Click to reset your password'
      }
    };
    return templates[templateName] || {};
  }
}

// Create global instance
window.EmailManager = new EmailManager();
