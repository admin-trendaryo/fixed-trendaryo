# Trendaryo Backend API

Enterprise-grade, self-healing ecommerce backend with comprehensive error handling, auto-recovery mechanisms, and production-ready security.

## Features

### 🛡️ Security
- JWT-based authentication with refresh tokens
- Password hashing with bcryptjs (12 salt rounds)
- Rate limiting on all endpoints
- CORS protection
- Helmet security headers
- Input validation and sanitization
- SQL injection prevention

### 🔄 Self-Healing Capabilities
- Automatic database reconnection with exponential backoff
- Error classification and recovery strategies
- Process-level error handlers (unhandledRejection, uncaughtException)
- Health check system with automatic recovery
- Token cleanup and management
- Memory leak prevention

### 📊 Monitoring & Logging
- Comprehensive logging with Winston
- Error tracking and history
- System health monitoring
- Admin dashboard for statistics
- Audit logging

### 💳 Payment Processing
- Stripe integration
- PayPal support
- Cash on Delivery (COD)
- Payment status tracking
- Transaction logging

### 📦 Database
- SQLite for simplicity and portability
- Automatic table creation
- Data backup system
- Transaction support

## Installation

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Setup

1. **Clone and navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env
```

4. **Configure environment variables**
Edit `.env` and update:
- `JWT_SECRET` - Change to a strong random string
- `JWT_REFRESH_SECRET` - Change to a strong random string
- `STRIPE_PUBLIC_KEY` - Your Stripe public key
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- Other configuration as needed

5. **Start the server**

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order status

### Cart
- `POST /api/cart` - Add item to cart
- `GET /api/cart` - Get cart
- `DELETE /api/cart/:productId` - Remove item from cart

### Payments
- `POST /api/payments` - Process payment
- `GET /api/payments/:id` - Get payment details

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Admin
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/errors` - Get error logs

### Health
- `GET /health` - System health check

## Error Handling

The system includes comprehensive error handling with automatic recovery:

### Error Types
- `ECONNREFUSED` - Database connection errors (auto-reconnect)
- `PROTOCOL_ERROR` - Protocol errors (auto-reset)
- `VALIDATION_ERROR` - Input validation errors
- `AUTH_ERROR` - Authentication errors
- `PAYMENT_ERROR` - Payment processing errors
- `RATE_LIMIT` - Rate limit exceeded
- `TIMEOUT` - Request timeout
- `MEMORY_ERROR` - Memory issues (auto-cleanup)

### Recovery Strategies
Each error type has a dedicated recovery strategy that:
1. Logs the error with context
2. Attempts automatic recovery
3. Returns appropriate HTTP status
4. Provides detailed error information

## Database Schema

### Users
- id (UUID)
- email (unique)
- password (hashed)
- firstName, lastName
- phone
- role (customer, admin)
- status (active, inactive)
- timestamps

### Products
- id (UUID)
- name, description
- price, oldPrice
- emoji, badge
- stock
- status
- timestamps

### Orders
- id (UUID)
- userId (FK)
- status (pending, confirmed, shipped, delivered, cancelled)
- subtotal, shipping, tax, total
- paymentMethod, paymentStatus
- shippingAddress (JSON)
- timestamps

### Payments
- id (UUID)
- orderId (FK)
- amount, currency
- status (pending, processing, completed, failed)
- method, transactionId
- errorMessage
- timestamps

### Cart
- id (UUID)
- userId (FK)
- productId (FK)
- quantity
- timestamps

### Audit Log
- id (UUID)
- userId (FK)
- action, resource, resourceId
- changes (JSON)
- ipAddress
- timestamp

## Deployment

### Docker
```bash
docker build -t trendaryo-backend .
docker run -p 3000:3000 --env-file .env trendaryo-backend
```

### Environment Variables for Production
```bash
NODE_ENV=production
JWT_SECRET=<strong-random-string>
JWT_REFRESH_SECRET=<strong-random-string>
STRIPE_SECRET_KEY=<your-stripe-key>
CORS_ORIGIN=https://yourdomain.com
```

### Database Backup
Automatic backups are created daily. Access them in `/backups/` directory.

Manual backup:
```bash
npm run backup
```

## Monitoring

### Health Check
```bash
curl http://localhost:3000/health
```

Response includes:
- Database status
- Active tokens
- Memory usage
- Uptime

### Error Logs
Admin endpoint to view error history:
```bash
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/admin/errors
```

## Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

Watch mode:
```bash
npm run test:watch
```

## Performance Optimization

- Request compression enabled
- Connection pooling
- Query optimization
- Caching strategies
- Rate limiting
- Memory management

## Security Best Practices

1. **Change default secrets** in `.env`
2. **Use HTTPS** in production
3. **Enable CORS** only for trusted domains
4. **Rotate JWT secrets** periodically
5. **Monitor error logs** for suspicious activity
6. **Keep dependencies updated**
7. **Use strong passwords** for admin accounts
8. **Enable payment verification** in production

## Troubleshooting

### Database Connection Failed
- Check if database file exists
- Verify file permissions
- Check logs in `/logs/` directory

### Payment Processing Failed
- Verify Stripe API keys
- Check payment method support
- Review payment logs

### High Memory Usage
- Check for memory leaks in logs
- Restart server if needed
- Review active connections

### Rate Limiting Issues
- Adjust `RATE_LIMIT_MAX_REQUESTS` in `.env`
- Check client IP configuration
- Review rate limit logs

## Support

For issues and questions:
1. Check error logs in `/logs/`
2. Review health check endpoint
3. Check admin error dashboard
4. Review documentation

## License

MIT

## Version

1.0.0

---

**Built with ❤️ for Trendaryo**
