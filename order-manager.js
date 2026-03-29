/**
 * ORDER MANAGEMENT SYSTEM
 * Handles order creation, tracking, history, and status management
 */

class OrderManager {
  constructor() {
    this.API_BASE = 'http://localhost:3000';
    this.ORDERS_KEY = 'trendaryo_orders';
    this.loadOrdersFromStorage();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ORDER CREATION
  // ═══════════════════════════════════════════════════════════════════════════

  async createOrder(orderData) {
    try {
      const token = localStorage.getItem('trendaryo_access_token');
      if (!token) throw new Error('User not authenticated');

      const response = await fetch(`${this.API_BASE}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Failed to create order');

      // Store locally
      this.addOrderToStorage(data.data);

      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ORDER RETRIEVAL
  // ═══════════════════════════════════════════════════════════════════════════

  async getOrders(limit = 10, offset = 0) {
    try {
      const token = localStorage.getItem('trendaryo_access_token');
      if (!token) throw new Error('User not authenticated');

      const response = await fetch(
        `${this.API_BASE}/api/orders?limit=${limit}&offset=${offset}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Failed to fetch orders');

      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getOrderById(orderId) {
    try {
      const token = localStorage.getItem('trendaryo_access_token');
      if (!token) throw new Error('User not authenticated');

      const response = await fetch(`${this.API_BASE}/api/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Failed to fetch order');

      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ORDER STATUS MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  async updateOrderStatus(orderId, status) {
    try {
      const token = localStorage.getItem('trendaryo_access_token');
      if (!token) throw new Error('User not authenticated');

      const response = await fetch(`${this.API_BASE}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Failed to update order');

      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async cancelOrder(orderId, reason = '') {
    try {
      const token = localStorage.getItem('trendaryo_access_token');
      if (!token) throw new Error('User not authenticated');

      const response = await fetch(`${this.API_BASE}/api/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Failed to cancel order');

      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ORDER TRACKING
  // ═══════════════════════════════════════════════════════════════════════════

  async getTrackingInfo(orderId) {
    try {
      const token = localStorage.getItem('trendaryo_access_token');
      if (!token) throw new Error('User not authenticated');

      const response = await fetch(`${this.API_BASE}/api/orders/${orderId}/tracking`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Failed to fetch tracking info');

      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateTrackingInfo(orderId, trackingData) {
    try {
      const token = localStorage.getItem('trendaryo_access_token');
      if (!token) throw new Error('User not authenticated');

      const response = await fetch(`${this.API_BASE}/api/orders/${orderId}/tracking`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(trackingData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Failed to update tracking');

      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ORDER ITEMS MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  async getOrderItems(orderId) {
    try {
      const token = localStorage.getItem('trendaryo_access_token');
      if (!token) throw new Error('User not authenticated');

      const response = await fetch(`${this.API_BASE}/api/orders/${orderId}/items`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Failed to fetch order items');

      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ORDER STATISTICS
  // ═══════════════════════════════════════════════════════════════════════════

  async getOrderStats() {
    try {
      const token = localStorage.getItem('trendaryo_access_token');
      if (!token) throw new Error('User not authenticated');

      const response = await fetch(`${this.API_BASE}/api/orders/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Failed to fetch stats');

      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // LOCAL STORAGE MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  addOrderToStorage(order) {
    try {
      this.orders.unshift(order);
      this.saveOrdersToStorage();
    } catch (e) {
      console.warn('Failed to save order to storage:', e);
    }
  }

  saveOrdersToStorage() {
    try {
      localStorage.setItem(this.ORDERS_KEY, JSON.stringify(this.orders.slice(0, 50)));
    } catch (e) {
      console.warn('Orders storage quota exceeded');
    }
  }

  loadOrdersFromStorage() {
    try {
      const stored = localStorage.getItem(this.ORDERS_KEY);
      this.orders = stored ? JSON.parse(stored) : [];
    } catch (e) {
      this.orders = [];
    }
  }

  getLocalOrders() {
    return this.orders;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ORDER FILTERING & SORTING
  // ═══════════════════════════════════════════════════════════════════════════

  filterOrdersByStatus(status) {
    return this.orders.filter(order => order.status === status);
  }

  filterOrdersByDateRange(startDate, endDate) {
    return this.orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate <= endDate;
    });
  }

  filterOrdersByAmount(minAmount, maxAmount) {
    return this.orders.filter(order => {
      return order.total >= minAmount && order.total <= maxAmount;
    });
  }

  sortOrdersByDate(ascending = false) {
    return [...this.orders].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }

  sortOrdersByAmount(ascending = false) {
    return [...this.orders].sort((a, b) => {
      return ascending ? a.total - b.total : b.total - a.total;
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ORDER ANALYTICS
  // ═══════════════════════════════════════════════════════════════════════════

  getTotalSpent() {
    return this.orders.reduce((sum, order) => sum + order.total, 0);
  }

  getAverageOrderValue() {
    if (this.orders.length === 0) return 0;
    return this.getTotalSpent() / this.orders.length;
  }

  getOrderCount() {
    return this.orders.length;
  }

  getOrdersByStatus() {
    const stats = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    };

    this.orders.forEach(order => {
      if (stats.hasOwnProperty(order.status)) {
        stats[order.status]++;
      }
    });

    return stats;
  }

  getRecentOrders(count = 5) {
    return this.orders.slice(0, count);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ORDER EXPORT
  // ═══════════════════════════════════════════════════════════════════════════

  exportOrdersToCSV() {
    const headers = ['Order ID', 'Date', 'Status', 'Total', 'Items', 'Shipping Address'];
    const rows = this.orders.map(order => [
      order.id,
      new Date(order.createdAt).toLocaleDateString(),
      order.status,
      `$${order.total.toFixed(2)}`,
      order.items.length,
      `${order.shippingAddress.city}, ${order.shippingAddress.state}`
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  exportOrdersToJSON() {
    const json = JSON.stringify(this.orders, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ORDER UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════

  getStatusColor(status) {
    const colors = {
      pending: '#ffd700',
      processing: '#00f0ff',
      shipped: '#00ff88',
      delivered: '#00ff88',
      cancelled: '#ff6b6b'
    };
    return colors[status] || '#fff';
  }

  getStatusIcon(status) {
    const icons = {
      pending: '⏳',
      processing: '⚙️',
      shipped: '🚚',
      delivered: '✅',
      cancelled: '❌'
    };
    return icons[status] || '📦';
  }

  formatOrderDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatOrderTime(date) {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  calculateDaysAgo(date) {
    const now = new Date();
    const orderDate = new Date(date);
    const diffTime = Math.abs(now - orderDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  getEstimatedDeliveryDate(orderDate, shippingMethod = 'standard') {
    const date = new Date(orderDate);
    const days = shippingMethod === 'express' ? 3 : 7;
    date.setDate(date.getDate() + days);
    return date;
  }
}

// Create global instance
window.OrderManager = new OrderManager();
