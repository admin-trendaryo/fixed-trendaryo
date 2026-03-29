/**
 * Admin Manager - Complete Admin Operations System
 * Handles user management, order management, payment management, email management, analytics, and inventory
 */

class AdminManager {
  constructor() {
    this.apiBase = 'http://localhost:5000/api';
    this.adminToken = localStorage.getItem('adminToken');
    this.userRole = localStorage.getItem('userRole');
  }

  // ==================== AUTHENTICATION ====================

  /**
   * Check if user is admin
   */
  isAdmin() {
    return this.userRole === 'admin' && this.adminToken;
  }

  /**
   * Get admin token
   */
  getAdminToken() {
    return this.adminToken;
  }

  /**
   * Make authenticated admin request
   */
  async adminRequest(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.adminToken}`,
      ...options.headers
    };

    try {
      const response = await fetch(`${this.apiBase}${endpoint}`, {
        ...options,
        headers
      });

      if (!response.ok) {
        throw new Error(`Admin request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Admin request error:', error);
      throw error;
    }
  }

  // ==================== USER MANAGEMENT ====================

  /**
   * Get all users with pagination and filtering
   */
  async getAllUsers(page = 1, limit = 20, filters = {}) {
    const params = new URLSearchParams({
      page,
      limit,
      ...filters
    });

    return this.adminRequest(`/admin/users?${params}`);
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    return this.adminRequest(`/admin/users/${userId}`);
  }

  /**
   * Update user information
   */
  async updateUser(userId, userData) {
    return this.adminRequest(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  /**
   * Deactivate user account
   */
  async deactivateUser(userId, reason = '') {
    return this.adminRequest(`/admin/users/${userId}/deactivate`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
  }

  /**
   * Reactivate user account
   */
  async reactivateUser(userId) {
    return this.adminRequest(`/admin/users/${userId}/reactivate`, {
      method: 'POST'
    });
  }

  /**
   * Reset user password
   */
  async resetUserPassword(userId) {
    return this.adminRequest(`/admin/users/${userId}/reset-password`, {
      method: 'POST'
    });
  }

  /**
   * Get user statistics
   */
  async getUserStats() {
    return this.adminRequest('/admin/users/stats');
  }

  /**
   * Search users
   */
  async searchUsers(query) {
    return this.adminRequest(`/admin/users/search?q=${encodeURIComponent(query)}`);
  }

  /**
   * Export users to CSV
   */
  async exportUsers(filters = {}) {
    return this.adminRequest('/admin/users/export', {
      method: 'POST',
      body: JSON.stringify(filters)
    });
  }

  // ==================== ORDER MANAGEMENT ====================

  /**
   * Get all orders with pagination and filtering
   */
  async getAllOrders(page = 1, limit = 20, filters = {}) {
    const params = new URLSearchParams({
      page,
      limit,
      ...filters
    });

    return this.adminRequest(`/admin/orders?${params}`);
  }

  /**
   * Get order by ID
   */
  async getOrderById(orderId) {
    return this.adminRequest(`/admin/orders/${orderId}`);
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId, status, notes = '') {
    return this.adminRequest(`/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes })
    });
  }

  /**
   * Add tracking information
   */
  async addTracking(orderId, trackingData) {
    return this.adminRequest(`/admin/orders/${orderId}/tracking`, {
      method: 'POST',
      body: JSON.stringify(trackingData)
    });
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId, reason = '') {
    return this.adminRequest(`/admin/orders/${orderId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
  }

  /**
   * Get order statistics
   */
  async getOrderStats() {
    return this.adminRequest('/admin/orders/stats');
  }

  /**
   * Get orders by date range
   */
  async getOrdersByDateRange(startDate, endDate) {
    return this.adminRequest(`/admin/orders/date-range?start=${startDate}&end=${endDate}`);
  }

  /**
   * Export orders to CSV
   */
  async exportOrders(filters = {}) {
    return this.adminRequest('/admin/orders/export', {
      method: 'POST',
      body: JSON.stringify(filters)
    });
  }

  // ==================== PAYMENT MANAGEMENT ====================

  /**
   * Get all transactions
   */
  async getAllTransactions(page = 1, limit = 20, filters = {}) {
    const params = new URLSearchParams({
      page,
      limit,
      ...filters
    });

    return this.adminRequest(`/admin/payments?${params}`);
  }

  /**
   * Get transaction by ID
   */
  async getTransactionById(transactionId) {
    return this.adminRequest(`/admin/payments/${transactionId}`);
  }

  /**
   * Process refund
   */
  async processRefund(transactionId, amount, reason = '') {
    return this.adminRequest(`/admin/payments/${transactionId}/refund`, {
      method: 'POST',
      body: JSON.stringify({ amount, reason })
    });
  }

  /**
   * Get payment statistics
   */
  async getPaymentStats() {
    return this.adminRequest('/admin/payments/stats');
  }

  /**
   * Get revenue by date range
   */
  async getRevenueByDateRange(startDate, endDate) {
    return this.adminRequest(`/admin/payments/revenue?start=${startDate}&end=${endDate}`);
  }

  /**
   * Get payment methods breakdown
   */
  async getPaymentMethodsBreakdown() {
    return this.adminRequest('/admin/payments/methods');
  }

  /**
   * Export transactions to CSV
   */
  async exportTransactions(filters = {}) {
    return this.adminRequest('/admin/payments/export', {
      method: 'POST',
      body: JSON.stringify(filters)
    });
  }

  // ==================== EMAIL MANAGEMENT ====================

  /**
   * Get all sent emails
   */
  async getAllEmails(page = 1, limit = 20, filters = {}) {
    const params = new URLSearchParams({
      page,
      limit,
      ...filters
    });

    return this.adminRequest(`/admin/emails?${params}`);
  }

  /**
   * Get email by ID
   */
  async getEmailById(emailId) {
    return this.adminRequest(`/admin/emails/${emailId}`);
  }

  /**
   * Resend email
   */
  async resendEmail(emailId) {
    return this.adminRequest(`/admin/emails/${emailId}/resend`, {
      method: 'POST'
    });
  }

  /**
   * Get email templates
   */
  async getEmailTemplates() {
    return this.adminRequest('/admin/emails/templates');
  }

  /**
   * Update email template
   */
  async updateEmailTemplate(templateId, templateData) {
    return this.adminRequest(`/admin/emails/templates/${templateId}`, {
      method: 'PUT',
      body: JSON.stringify(templateData)
    });
  }

  /**
   * Send bulk email
   */
  async sendBulkEmail(recipients, subject, template, data = {}) {
    return this.adminRequest('/admin/emails/bulk', {
      method: 'POST',
      body: JSON.stringify({ recipients, subject, template, data })
    });
  }

  /**
   * Get email statistics
   */
  async getEmailStats() {
    return this.adminRequest('/admin/emails/stats');
  }

  /**
   * Export email history
   */
  async exportEmailHistory(filters = {}) {
    return this.adminRequest('/admin/emails/export', {
      method: 'POST',
      body: JSON.stringify(filters)
    });
  }

  // ==================== ANALYTICS ====================

  /**
   * Get dashboard overview
   */
  async getDashboardOverview() {
    return this.adminRequest('/admin/analytics/overview');
  }

  /**
   * Get sales analytics
   */
  async getSalesAnalytics(period = 'month') {
    return this.adminRequest(`/admin/analytics/sales?period=${period}`);
  }

  /**
   * Get customer analytics
   */
  async getCustomerAnalytics(period = 'month') {
    return this.adminRequest(`/admin/analytics/customers?period=${period}`);
  }

  /**
   * Get product analytics
   */
  async getProductAnalytics(period = 'month') {
    return this.adminRequest(`/admin/analytics/products?period=${period}`);
  }

  /**
   * Get conversion analytics
   */
  async getConversionAnalytics(period = 'month') {
    return this.adminRequest(`/admin/analytics/conversion?period=${period}`);
  }

  /**
   * Get traffic analytics
   */
  async getTrafficAnalytics(period = 'month') {
    return this.adminRequest(`/admin/analytics/traffic?period=${period}`);
  }

  /**
   * Get revenue report
   */
  async getRevenueReport(startDate, endDate) {
    return this.adminRequest(`/admin/analytics/revenue?start=${startDate}&end=${endDate}`);
  }

  /**
   * Get top products
   */
  async getTopProducts(limit = 10) {
    return this.adminRequest(`/admin/analytics/top-products?limit=${limit}`);
  }

  /**
   * Get top customers
   */
  async getTopCustomers(limit = 10) {
    return this.adminRequest(`/admin/analytics/top-customers?limit=${limit}`);
  }

  // ==================== INVENTORY MANAGEMENT ====================

  /**
   * Get all products with stock info
   */
  async getAllProducts(page = 1, limit = 20, filters = {}) {
    const params = new URLSearchParams({
      page,
      limit,
      ...filters
    });

    return this.adminRequest(`/admin/inventory?${params}`);
  }

  /**
   * Get product by ID
   */
  async getProductById(productId) {
    return this.adminRequest(`/admin/inventory/${productId}`);
  }

  /**
   * Update product stock
   */
  async updateProductStock(productId, quantity, reason = '') {
    return this.adminRequest(`/admin/inventory/${productId}/stock`, {
      method: 'PUT',
      body: JSON.stringify({ quantity, reason })
    });
  }

  /**
   * Get low stock products
   */
  async getLowStockProducts(threshold = 10) {
    return this.adminRequest(`/admin/inventory/low-stock?threshold=${threshold}`);
  }

  /**
   * Get out of stock products
   */
  async getOutOfStockProducts() {
    return this.adminRequest('/admin/inventory/out-of-stock');
  }

  /**
   * Update product information
   */
  async updateProduct(productId, productData) {
    return this.adminRequest(`/admin/inventory/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  }

  /**
   * Get inventory statistics
   */
  async getInventoryStats() {
    return this.adminRequest('/admin/inventory/stats');
  }

  /**
   * Export inventory to CSV
   */
  async exportInventory(filters = {}) {
    return this.adminRequest('/admin/inventory/export', {
      method: 'POST',
      body: JSON.stringify(filters)
    });
  }

  // ==================== SYSTEM MANAGEMENT ====================

  /**
   * Get system health status
   */
  async getSystemHealth() {
    return this.adminRequest('/admin/system/health');
  }

  /**
   * Get system logs
   */
  async getSystemLogs(page = 1, limit = 50, filters = {}) {
    const params = new URLSearchParams({
      page,
      limit,
      ...filters
    });

    return this.adminRequest(`/admin/system/logs?${params}`);
  }

  /**
   * Get audit trail
   */
  async getAuditTrail(page = 1, limit = 50, filters = {}) {
    const params = new URLSearchParams({
      page,
      limit,
      ...filters
    });

    return this.adminRequest(`/admin/system/audit?${params}`);
  }

  /**
   * Get system settings
   */
  async getSystemSettings() {
    return this.adminRequest('/admin/system/settings');
  }

  /**
   * Update system settings
   */
  async updateSystemSettings(settings) {
    return this.adminRequest('/admin/system/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  }

  /**
   * Get backup status
   */
  async getBackupStatus() {
    return this.adminRequest('/admin/system/backup');
  }

  /**
   * Trigger backup
   */
  async triggerBackup() {
    return this.adminRequest('/admin/system/backup', {
      method: 'POST'
    });
  }

  // ==================== UTILITY FUNCTIONS ====================

  /**
   * Format currency
   */
  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  /**
   * Format date
   */
  formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Format date and time
   */
  formatDateTime(date) {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Get status badge color
   */
  getStatusColor(status) {
    const colors = {
      'pending': '#FFA500',
      'processing': '#4169E1',
      'shipped': '#32CD32',
      'delivered': '#228B22',
      'cancelled': '#DC143C',
      'refunded': '#FF69B4',
      'active': '#32CD32',
      'inactive': '#808080',
      'suspended': '#DC143C'
    };
    return colors[status] || '#808080';
  }

  /**
   * Export data to CSV
   */
  exportToCSV(data, filename) {
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Generate report
   */
  generateReport(title, data, format = 'pdf') {
    console.log(`Generating ${format} report: ${title}`);
    // Implementation depends on PDF library
    return {
      title,
      data,
      format,
      generatedAt: new Date()
    };
  }

  /**
   * Send notification
   */
  sendNotification(title, message, type = 'info') {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/favicon.ico'
      });
    }
  }

  /**
   * Log admin action
   */
  async logAdminAction(action, details) {
    return this.adminRequest('/admin/system/audit', {
      method: 'POST',
      body: JSON.stringify({ action, details, timestamp: new Date() })
    });
  }
}

// Initialize and expose globally
window.AdminManager = new AdminManager();
