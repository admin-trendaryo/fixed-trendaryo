# 🚀 PHASE 5: ADMIN DASHBOARD - QUICK REFERENCE

## 📋 Quick Links

- **Main Dashboard**: `admin-dashboard-enhanced.html`
- **User Management**: `admin-users-enhanced.html`
- **Order Management**: `admin-orders-enhanced.html`
- **Payment Management**: `admin-payments.html`
- **Email Management**: `admin-emails.html`
- **Analytics**: `admin-analytics.html`
- **Inventory**: `admin-inventory.html`
- **Core Manager**: `admin-manager.js`

---

## 🔐 Authentication

```javascript
// Check if user is admin
if (window.AdminManager.isAdmin()) {
    // Admin operations
}

// Get admin token
const token = window.AdminManager.getAdminToken();

// Make authenticated request
const result = await window.AdminManager.adminRequest('/api/endpoint', {
    method: 'GET'
});
```

---

## 👥 User Management

```javascript
// Get all users
const users = await window.AdminManager.getAllUsers(page, limit, filters);

// Get specific user
const user = await window.AdminManager.getUserById(userId);

// Update user
await window.AdminManager.updateUser(userId, {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    status: 'active'
});

// Deactivate user
await window.AdminManager.deactivateUser(userId, 'Reason for deactivation');

// Reactivate user
await window.AdminManager.reactivateUser(userId);

// Reset password
await window.AdminManager.resetUserPassword(userId);

// Get user stats
const stats = await window.AdminManager.getUserStats();

// Search users
const results = await window.AdminManager.searchUsers('john');

// Export users
const data = await window.AdminManager.exportUsers(filters);
window.AdminManager.exportToCSV(data.data, 'users');
```

---

## 📦 Order Management

```javascript
// Get all orders
const orders = await window.AdminManager.getAllOrders(page, limit, filters);

// Get specific order
const order = await window.AdminManager.getOrderById(orderId);

// Update order status
await window.AdminManager.updateOrderStatus(orderId, 'shipped', 'Order shipped');

// Add tracking
await window.AdminManager.addTracking(orderId, {
    trackingNumber: '1Z999AA10123456784',
    carrier: 'UPS',
    estimatedDelivery: '2024-01-15'
});

// Cancel order
await window.AdminManager.cancelOrder(orderId, 'Customer requested');

// Get order stats
const stats = await window.AdminManager.getOrderStats();

// Get orders by date range
const orders = await window.AdminManager.getOrdersByDateRange('2024-01-01', '2024-01-31');

// Export orders
const data = await window.AdminManager.exportOrders(filters);
window.AdminManager.exportToCSV(data.data, 'orders');
```

---

## 💳 Payment Management

```javascript
// Get all transactions
const transactions = await window.AdminManager.getAllTransactions(page, limit, filters);

// Get specific transaction
const tx = await window.AdminManager.getTransactionById(transactionId);

// Process refund
await window.AdminManager.processRefund(transactionId, 100.00, 'Customer request');

// Get payment stats
const stats = await window.AdminManager.getPaymentStats();

// Get revenue by date range
const revenue = await window.AdminManager.getRevenueByDateRange('2024-01-01', '2024-01-31');

// Get payment methods breakdown
const methods = await window.AdminManager.getPaymentMethodsBreakdown();

// Export transactions
const data = await window.AdminManager.exportTransactions(filters);
window.AdminManager.exportToCSV(data.data, 'transactions');
```

---

## 📧 Email Management

```javascript
// Get all emails
const emails = await window.AdminManager.getAllEmails(page, limit, filters);

// Get specific email
const email = await window.AdminManager.getEmailById(emailId);

// Resend email
await window.AdminManager.resendEmail(emailId);

// Get email templates
const templates = await window.AdminManager.getEmailTemplates();

// Update email template
await window.AdminManager.updateEmailTemplate(templateId, {
    name: 'Welcome Email',
    subject: 'Welcome to Trendaryo',
    body: '<h1>Welcome!</h1>'
});

// Send bulk email
await window.AdminManager.sendBulkEmail(
    ['user1@example.com', 'user2@example.com'],
    'Special Offer',
    'promotional',
    { discount: '20%' }
);

// Get email stats
const stats = await window.AdminManager.getEmailStats();

// Export email history
const data = await window.AdminManager.exportEmailHistory(filters);
window.AdminManager.exportToCSV(data.data, 'emails');
```

---

## 📈 Analytics

```javascript
// Get dashboard overview
const overview = await window.AdminManager.getDashboardOverview();

// Get sales analytics
const sales = await window.AdminManager.getSalesAnalytics('month');

// Get customer analytics
const customers = await window.AdminManager.getCustomerAnalytics('month');

// Get product analytics
const products = await window.AdminManager.getProductAnalytics('month');

// Get conversion analytics
const conversion = await window.AdminManager.getConversionAnalytics('month');

// Get traffic analytics
const traffic = await window.AdminManager.getTrafficAnalytics('month');

// Get revenue report
const revenue = await window.AdminManager.getRevenueReport('2024-01-01', '2024-01-31');

// Get top products
const topProducts = await window.AdminManager.getTopProducts(10);

// Get top customers
const topCustomers = await window.AdminManager.getTopCustomers(10);
```

---

## 📦 Inventory Management

```javascript
// Get all products
const products = await window.AdminManager.getAllProducts(page, limit, filters);

// Get specific product
const product = await window.AdminManager.getProductById(productId);

// Update product stock
await window.AdminManager.updateProductStock(productId, 100, 'Restock');

// Get low stock products
const lowStock = await window.AdminManager.getLowStockProducts(10);

// Get out of stock products
const outOfStock = await window.AdminManager.getOutOfStockProducts();

// Update product info
await window.AdminManager.updateProduct(productId, {
    name: 'Product Name',
    price: 99.99,
    description: 'Product description'
});

// Get inventory stats
const stats = await window.AdminManager.getInventoryStats();

// Export inventory
const data = await window.AdminManager.exportInventory(filters);
window.AdminManager.exportToCSV(data.data, 'inventory');
```

---

## 🛠️ System Management

```javascript
// Get system health
const health = await window.AdminManager.getSystemHealth();

// Get system logs
const logs = await window.AdminManager.getSystemLogs(page, limit, filters);

// Get audit trail
const audit = await window.AdminManager.getAuditTrail(page, limit, filters);

// Get system settings
const settings = await window.AdminManager.getSystemSettings();

// Update system settings
await window.AdminManager.updateSystemSettings({
    siteName: 'Trendaryo',
    taxRate: 0.08
});

// Get backup status
const backup = await window.AdminManager.getBackupStatus();

// Trigger backup
await window.AdminManager.triggerBackup();

// Log admin action
await window.AdminManager.logAdminAction('user_updated', {
    userId: 123,
    changes: { status: 'active' }
});
```

---

## 🎨 Utility Functions

```javascript
// Format currency
const formatted = window.AdminManager.formatCurrency(1000, 'USD');
// Output: $1,000.00

// Format date
const date = window.AdminManager.formatDate('2024-01-15');
// Output: Jan 15, 2024

// Format date and time
const dateTime = window.AdminManager.formatDateTime('2024-01-15T10:30:00');
// Output: Jan 15, 2024, 10:30 AM

// Get status color
const color = window.AdminManager.getStatusColor('pending');
// Output: #FFA500

// Export to CSV
window.AdminManager.exportToCSV(data, 'filename');

// Generate report
const report = window.AdminManager.generateReport('Sales Report', data, 'pdf');

// Send notification
window.AdminManager.sendNotification('Success', 'Operation completed', 'success');
```

---

## 🔍 Common Filters

```javascript
// User filters
const userFilters = {
    search: 'john',
    status: 'active',
    sort: 'newest'
};

// Order filters
const orderFilters = {
    search: 'ORD-001',
    status: 'pending',
    dateFrom: '2024-01-01',
    dateTo: '2024-01-31'
};

// Payment filters
const paymentFilters = {
    search: 'TXN-001',
    status: 'completed',
    dateFrom: '2024-01-01',
    dateTo: '2024-01-31'
};

// Email filters
const emailFilters = {
    search: 'user@example.com',
    type: 'order_confirmation',
    status: 'sent'
};

// Inventory filters
const inventoryFilters = {
    search: 'product',
    status: 'low_stock'
};
```

---

## 📊 Status Values

```javascript
// Order statuses
'pending', 'processing', 'shipped', 'delivered', 'cancelled'

// Payment statuses
'completed', 'pending', 'failed', 'refunded'

// User statuses
'active', 'inactive', 'suspended'

// Email statuses
'sent', 'pending', 'failed', 'bounced'

// Stock statuses
'in_stock', 'low_stock', 'out_of_stock'
```

---

## 🎯 Common Patterns

### Modal Dialog
```javascript
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}
```

### Loading State
```javascript
const loading = `
    <div class="loading">
        <div class="spinner"></div>
        Loading...
    </div>
`;
```

### Error Handling
```javascript
try {
    const result = await window.AdminManager.getAllUsers();
} catch (error) {
    console.error('Error:', error);
    alert('Failed to load users');
}
```

### Pagination
```javascript
function displayPagination(pagination) {
    let html = '';
    for (let i = 1; i <= pagination.totalPages; i++) {
        html += `<button onclick="loadPage(${i})">${i}</button>`;
    }
    document.getElementById('pagination').innerHTML = html;
}
```

---

## 🚀 Getting Started

1. **Include the script**:
   ```html
   <script src="admin-manager.js"></script>
   ```

2. **Check admin access**:
   ```javascript
   if (!window.AdminManager.isAdmin()) {
       window.location.href = 'admin-login.html';
   }
   ```

3. **Load data**:
   ```javascript
   const users = await window.AdminManager.getAllUsers(1, 20);
   ```

4. **Display data**:
   ```javascript
   displayUsers(users.data);
   ```

5. **Handle actions**:
   ```javascript
   await window.AdminManager.updateUser(userId, userData);
   ```

---

## 📞 Support

For more information, see:
- `ADMIN_DASHBOARD_GUIDE.md` - Complete guide
- `IMPLEMENTATION_SUMMARY.md` - Overview
- Code comments in `admin-manager.js`

---

**Last Updated**: 2024  
**Version**: 1.0  
**Status**: Production Ready ✅
