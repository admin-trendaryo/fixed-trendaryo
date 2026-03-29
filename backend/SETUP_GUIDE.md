# TRENDARYO BACKEND - COMPLETE SETUP GUIDE

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Running the Server](#running-the-server)
5. [Database Setup](#database-setup)
6. [API Testing](#api-testing)
7. [Production Deployment](#production-deployment)
8. [Troubleshooting](#troubleshooting)
9. [Self-Healing Features](#self-healing-features)

---

## 🚀 Quick Start

### For Development (Windows)

```bash
# 1. Navigate to backend directory
cd "c:\Users\trendaryo\Desktop\FIXED TRENDARYO 1.0\backend"

# 2. Install dependencies
npm install

# 3. Create .env file
copy .env.example .env

# 4. Start development server
npm run dev
```

Server will start on `http://localhost:3000`

---

## 📦 Installation

### Prerequisites
- Node.js 18+ (Download from https://nodejs.org/)
- npm 9+ (comes with Node.js)
- Git (optional)

### Step-by-Step Installation

1. **Open Command Prompt/PowerShell**
   - Press `Win + R`
   - Type `cmd` or `powershell`
   - Navigate to backend folder

2. **Install Node Modules**
   ```bash
   npm install
   ```
   This will install all dependencies listed in package.json

3. **Verify Installation**
   ```bash
   npm --version
   node --version
   ```

---

## ⚙️ Configuration

### Create Environment File

1. **Copy example file**
   ```bash
   copy .env.example .env
   ```

2. **Edit .env file** (Open with Notepad or VS Code)
   ```
   NODE_ENV=development
   PORT=3000
   JWT_SECRET=your-super-secret-key-12345
   JWT_REFRESH_SECRET=your-refresh-secret-key-12345
   STRIPE_SECRET_KEY=sk_test_your_key_here
   CORS_ORIGIN=*
   ```

### Important Configuration Notes

- **JWT_SECRET**: Change to a random string (min 32 characters)
- **PORT**: Default 3000, change if port is in use
- **CORS_ORIGIN**: Set to your frontend URL in production
- **STRIPE_SECRET_KEY**: Get from Stripe dashboard

---

## 🏃 Running the Server

### Development Mode
```bash
npm run dev
```
- Auto-restarts on file changes
- Detailed logging
- Use for development only

### Production Mode
```bash
npm start
```
- Optimized performance
- Minimal logging
- Use for production

### Check Server Status
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "database": {
    "status": "healthy"
  },
  "uptime": 123.45
}
```

---

## 🗄️ Database Setup

### Automatic Setup
The database is automatically created on first run:
- Location: `./data/trendaryo.db`
- Tables: Automatically created
- No manual setup needed

### Manual Database Reset
```bash
# Delete database file
del data\trendaryo.db

# Restart server to recreate
npm run dev
```

### Database Backup
```bash
npm run backup
```
Backups are saved in `./backups/` directory

---

## 🧪 API Testing

### Using cURL (Command Line)

**Register User**
```bash
curl -X POST http://localhost:3000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\",\"firstName\":\"John\",\"lastName\":\"Doe\",\"phone\":\"+1234567890\"}"
```

**Login User**
```bash
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

**Get Products**
```bash
curl http://localhost:3000/api/products
```

### Using Postman

1. Download Postman from https://www.postman.com/downloads/
2. Import collection from `./postman-collection.json`
3. Set environment variables
4. Run requests

### Using Frontend Integration

See `FRONTEND_INTEGRATION.js` for JavaScript examples

---

## 🌐 Production Deployment

### Option 1: Deploy to Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   heroku create trendaryo-api
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set JWT_SECRET=your-production-secret
   heroku config:set STRIPE_SECRET_KEY=sk_live_your_key
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 2: Deploy to AWS

1. **Create EC2 Instance**
   - Ubuntu 20.04 LTS
   - t2.micro (free tier)

2. **SSH into Instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

3. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Clone Repository**
   ```bash
   git clone your-repo-url
   cd backend
   npm install
   ```

5. **Setup PM2 (Process Manager)**
   ```bash
   sudo npm install -g pm2
   pm2 start server.js --name "trendaryo-api"
   pm2 startup
   pm2 save
   ```

6. **Setup Nginx (Reverse Proxy)**
   ```bash
   sudo apt-get install nginx
   ```

   Edit `/etc/nginx/sites-available/default`:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Restart Nginx:
   ```bash
   sudo systemctl restart nginx
   ```

### Option 3: Deploy with Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build Image**
   ```bash
   docker build -t trendaryo-api .
   ```

3. **Run Container**
   ```bash
   docker run -p 3000:3000 --env-file .env trendaryo-api
   ```

---

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or use different port
set PORT=3001
npm run dev
```

### Database Connection Error
```bash
# Check if data directory exists
dir data

# If not, create it
mkdir data

# Restart server
npm run dev
```

### Module Not Found Error
```bash
# Reinstall dependencies
rm -r node_modules
npm install
```

### Memory Issues
```bash
# Run with increased memory
node --max-old-space-size=4096 server.js
```

### CORS Errors
- Update `CORS_ORIGIN` in `.env`
- Example: `CORS_ORIGIN=http://localhost:8080`

---

## 🛡️ Self-Healing Features

### Automatic Database Reconnection
- Detects connection failures
- Attempts reconnection with exponential backoff
- Logs all attempts
- Automatically recovers

### Error Recovery
- Classifies errors automatically
- Applies appropriate recovery strategy
- Logs recovery attempts
- Maintains error history

### Health Monitoring
- Runs every 30 seconds
- Checks database connectivity
- Monitors system resources
- Auto-triggers recovery if needed

### Token Management
- Automatic cleanup of expired tokens
- Revocation tracking
- Refresh token rotation
- Session management

### Memory Management
- Garbage collection triggers
- Memory leak detection
- Automatic cleanup
- Process monitoring

---

## 📊 Monitoring

### View Logs
```bash
# Real-time logs
tail -f logs/combined.log

# Error logs only
tail -f logs/error.log
```

### Health Check
```bash
curl http://localhost:3000/health
```

### Admin Dashboard
```bash
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/admin/stats
```

---

## 🔐 Security Checklist

- [ ] Change JWT_SECRET in .env
- [ ] Change JWT_REFRESH_SECRET in .env
- [ ] Set CORS_ORIGIN to your domain
- [ ] Enable HTTPS in production
- [ ] Use strong database passwords
- [ ] Enable rate limiting
- [ ] Setup firewall rules
- [ ] Regular backups enabled
- [ ] Monitor error logs
- [ ] Update dependencies regularly

---

## 📞 Support

### Common Issues

**Q: Server won't start**
A: Check logs in `logs/` directory, verify .env file, ensure port is available

**Q: Database errors**
A: Check `data/` directory exists, verify file permissions, check logs

**Q: Payment failures**
A: Verify Stripe keys, check payment logs, review transaction history

**Q: High memory usage**
A: Check for memory leaks in logs, restart server, review active connections

---

## 🎉 You're Ready!

Your Trendaryo backend is now set up and running. 

Next steps:
1. Test API endpoints
2. Connect frontend
3. Configure payment processing
4. Setup monitoring
5. Deploy to production

For more information, see README.md and FRONTEND_INTEGRATION.js

---

**Happy coding! 🚀**
