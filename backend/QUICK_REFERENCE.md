# ⚡ QUICK REFERENCE GUIDE

## 🚀 Start Server (30 seconds)

```bash
cd backend
npm install
npm run dev
```

Visit: http://localhost:3000/health

---

## 🔑 Authentication Flow

### Register
```bash
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

### Login
```bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response includes `accessToken` and `refreshToken`

### Use Token
```bash
Authorization: Bearer <accessToken>
```

---

## 📦 Product Operations

### Get All Products
```bash
GET /api/products?page=1&limit=20
```

### Get Single Product
```bash
GET /api/products/{id}
```

### Create Product (Admin)
```bash
POST /api/products
{
  "name": "Product Name",
  "description": "Description",
  "price": 99.99,
  "emoji": "🎧",
  "badge": "hot",
  "stock": 100
}
```

### Update Product (Admin)
```bash
PUT /api/products/{id}
{
  "price": 89.99,
  "stock": 50
}
```

### Delete Product (Admin)
```bash
DELETE /api/products/{id}
```

---

## 🛒 Shopping Cart

### Add to Cart
```bash
POST /api/cart
{
  "productId": "product-id",
  "quantity": 1
}
```

### Get Cart
```bash
GET /api/cart
```

### Remove from Cart
```bash
DELETE /api/cart/{productId}
```

---

## 📋 Orders

### Create Order
```bash
POST /api/orders
{
  "items": [
    {"productId": "id1", "quantity": 1},
    {"productId": "id2", "quantity": 2}
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001",
    "country": "US"
  },
  "paymentMethod": "card"
}
```

### Get Orders
```bash
GET /api/orders?page=1&limit=20
```

### Get Order Details
```bash
GET /api/orders/{orderId}
```

### Update Order Status
```bash
PUT /api/orders/{orderId}
{
  "status": "shipped"
}
```

Valid statuses: `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`

---

## 💳 Payments

### Process Payment
```bash
POST /api/payments
{
  "orderId": "order-id",
  "amount": 99.99,
  "currency": "USD",
  "paymentMethod": "card",
  "token": "stripe-token"
}
```

### Get Payment Details
```bash
GET /api/payments/{paymentId}
```

---

## 👤 User Profile

### Get Profile
```bash
GET /api/users/profile
```

### Update Profile
```bash
PUT /api/users/profile
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+1987654321"
}
```

---

## 📊 Admin Operations

### Get Statistics
```bash
GET /api/admin/stats
```

Returns: User count, product count, order stats, payment stats

### Get Error Logs
```bash
GET /api/admin/errors?limit=50
```

---

## 🔍 Health Check

```bash
GET /health
```

Response:
```json
{
  "status": "ok",
  "database": {"status": "healthy"},
  "uptime": 123.45,
  "memory": {...}
}
```

---

## 🛠️ Environment Variables

```bash
NODE_ENV=development
PORT=3000
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
STRIPE_SECRET_KEY=sk_test_key
CORS_ORIGIN=*
```

---

## 📝 Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {"field": "error message"}
  }
}
```

### Authentication Error (401)
```json
{
  "success": false,
  "error": {
    "code": "AUTH_ERROR",
    "message": "Invalid or expired token"
  }
}
```

### Not Found (404)
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

### Server Error (500)
```json
{
  "success": false,
  "error": {
    "id": "error-uuid",
    "code": "INTERNAL_ERROR",
    "message": "Internal server error"
  }
}
```

---

## 🧪 Testing with cURL

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123","firstName":"John","lastName":"Doe","phone":"+1234567890"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'
```

### Get Products
```bash
curl http://localhost:3000/api/products
```

### Add to Cart (with token)
```bash
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"productId":"product-id","quantity":1}'
```

---

## 🐛 Debugging

### View Logs
```bash
# Real-time logs
tail -f logs/combined.log

# Error logs only
tail -f logs/error.log

# Recovery logs
tail -f logs/error-recovery.jsonl
```

### Check Database
```bash
# Database file location
data/trendaryo.db

# View with SQLite
sqlite3 data/trendaryo.db
```

### Monitor Health
```bash
# Every 5 seconds
watch -n 5 'curl -s http://localhost:3000/health | jq'
```

---

## 🔄 Common Workflows

### Complete Purchase Flow

1. **Register/Login**
   ```bash
   POST /api/auth/login
   ```

2. **Browse Products**
   ```bash
   GET /api/products
   ```

3. **Add to Cart**
   ```bash
   POST /api/cart
   ```

4. **Create Order**
   ```bash
   POST /api/orders
   ```

5. **Process Payment**
   ```bash
   POST /api/payments
   ```

6. **Check Order Status**
   ```bash
   GET /api/orders/{orderId}
   ```

---

## 🚨 Troubleshooting

### Port Already in Use
```bash
# Find process
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F
```

### Database Error
```bash
# Delete and recreate
del data\trendaryo.db
npm run dev
```

### Module Not Found
```bash
# Reinstall
rm -r node_modules
npm install
```

### Token Expired
```bash
# Use refresh token
POST /api/auth/refresh
{
  "refreshToken": "your-refresh-token"
}
```

---

## 📱 Frontend Integration

```javascript
const api = new TrendaryoAPI('http://localhost:3000/api');

// Register
await api.register('email@example.com', 'password', 'John', 'Doe', '+1234567890');

// Login
await api.login('email@example.com', 'password');

// Get products
const products = await api.getProducts();

// Add to cart
await api.addToCart('product-id', 1);

// Create order
await api.createOrder(items, shippingAddress, 'card');

// Process payment
await api.processPayment(orderId, amount, 'USD', 'card', token);
```

---

## 🔐 Security Tips

- ✅ Always use HTTPS in production
- ✅ Change JWT_SECRET in .env
- ✅ Never commit .env file
- ✅ Use strong passwords
- ✅ Rotate tokens regularly
- ✅ Monitor error logs
- ✅ Keep dependencies updated
- ✅ Use rate limiting

---

## 📊 Performance Tips

- Use pagination for large datasets
- Cache frequently accessed data
- Optimize database queries
- Compress responses
- Use CDN for static files
- Monitor memory usage
- Set appropriate timeouts

---

## 🎯 Key Files

| File | Purpose |
|------|---------|
| server.js | Main application |
| src/utils/errorHandler.js | Error handling |
| src/utils/database.js | Database management |
| src/utils/auth.js | Authentication |
| src/routes/*.js | API endpoints |
| .env | Configuration |
| logs/ | Application logs |
| data/ | Database |

---

## 📞 Quick Help

**Server won't start?**
- Check port availability
- Verify .env file
- Check logs in logs/

**API returns 401?**
- Token expired? Use refresh endpoint
- Missing token? Add Authorization header
- Invalid token? Login again

**Database error?**
- Check data/ directory exists
- Verify file permissions
- Check logs for details

**Payment failed?**
- Verify Stripe keys
- Check payment logs
- Review transaction history

---

## 🎓 Learning Resources

- README.md - Full documentation
- SETUP_GUIDE.md - Installation guide
- FRONTEND_INTEGRATION.js - Code examples
- SYSTEM_SUMMARY.md - Architecture overview

---

**Happy coding! 🚀**

For more help, check the full documentation files.
