/**
 * DATABASE INITIALIZATION & HEALTH CHECK
 * Self-healing database connection with automatic recovery
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { logger } = require('./errorHandler');

class DatabaseManager {
  constructor() {
    this.db = null;
    this.isConnected = false;
    this.connectionAttempts = 0;
    this.maxConnectionAttempts = 5;
    this.healthCheckInterval = null;
  }

  async initialize() {
    try {
      const dbPath = path.join(__dirname, '../../data/trendaryo.db');
      
      return new Promise((resolve, reject) => {
        this.db = new sqlite3.Database(dbPath, (err) => {
          if (err) {
            logger.error('Database connection failed', { error: err.message });
            reject(err);
          } else {
            logger.info('Database connected successfully');
            this.isConnected = true;
            this.connectionAttempts = 0;
            this.createTables().then(resolve).catch(reject);
          }
        });
      });
    } catch (error) {
      logger.error('Database initialization failed', { error: error.message });
      throw error;
    }
  }

  async createTables() {
    const tables = [
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        firstName TEXT,
        lastName TEXT,
        phone TEXT,
        role TEXT DEFAULT 'customer',
        status TEXT DEFAULT 'active',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        oldPrice REAL,
        emoji TEXT,
        badge TEXT,
        stock INTEGER DEFAULT 0,
        status TEXT DEFAULT 'active',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        subtotal REAL NOT NULL,
        shipping REAL DEFAULT 0,
        tax REAL DEFAULT 0,
        total REAL NOT NULL,
        paymentMethod TEXT,
        paymentStatus TEXT DEFAULT 'pending',
        shippingAddress TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )`,

      `CREATE TABLE IF NOT EXISTS orderItems (
        id TEXT PRIMARY KEY,
        orderId TEXT NOT NULL,
        productId TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (orderId) REFERENCES orders(id),
        FOREIGN KEY (productId) REFERENCES products(id)
      )`,

      `CREATE TABLE IF NOT EXISTS cart (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        productId TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (productId) REFERENCES products(id)
      )`,

      `CREATE TABLE IF NOT EXISTS wishlist (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        productId TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (productId) REFERENCES products(id)
      )`,

      `CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        productId TEXT NOT NULL,
        userId TEXT NOT NULL,
        rating INTEGER NOT NULL,
        title TEXT,
        comment TEXT,
        status TEXT DEFAULT 'pending',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (productId) REFERENCES products(id),
        FOREIGN KEY (userId) REFERENCES users(id)
      )`,

      `CREATE TABLE IF NOT EXISTS payments (
        id TEXT PRIMARY KEY,
        orderId TEXT NOT NULL,
        amount REAL NOT NULL,
        currency TEXT DEFAULT 'USD',
        status TEXT DEFAULT 'pending',
        method TEXT,
        transactionId TEXT,
        errorMessage TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (orderId) REFERENCES orders(id)
      )`,

      `CREATE TABLE IF NOT EXISTS systemHealth (
        id TEXT PRIMARY KEY,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT,
        memoryUsage REAL,
        cpuUsage REAL,
        databaseStatus TEXT,
        errorCount INTEGER DEFAULT 0,
        lastError TEXT
      )`,

      `CREATE TABLE IF NOT EXISTS auditLog (
        id TEXT PRIMARY KEY,
        userId TEXT,
        action TEXT NOT NULL,
        resource TEXT,
        resourceId TEXT,
        changes TEXT,
        ipAddress TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )`
    ];

    for (const table of tables) {
      await this.run(table);
    }

    logger.info('All tables created successfully');
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          logger.error('Database run error', { error: err.message, sql });
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          logger.error('Database get error', { error: err.message });
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          logger.error('Database all error', { error: err.message });
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  async healthCheck() {
    try {
      const result = await this.get('SELECT 1');
      this.isConnected = true;
      logger.debug('Database health check passed');
      return { status: 'healthy', timestamp: new Date().toISOString() };
    } catch (error) {
      logger.error('Database health check failed', { error: error.message });
      this.isConnected = false;
      await this.attemptReconnection();
      return { status: 'unhealthy', error: error.message };
    }
  }

  async attemptReconnection() {
    if (this.connectionAttempts >= this.maxConnectionAttempts) {
      logger.error('Max connection attempts reached');
      return false;
    }

    this.connectionAttempts++;
    const delay = Math.pow(2, this.connectionAttempts) * 1000;
    
    logger.info(`Attempting reconnection (${this.connectionAttempts}/${this.maxConnectionAttempts}) in ${delay}ms`);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    try {
      await this.initialize();
      return true;
    } catch (error) {
      logger.error('Reconnection failed', { error: error.message });
      return false;
    }
  }

  startHealthCheckInterval(interval = 30000) {
    this.healthCheckInterval = setInterval(async () => {
      await this.healthCheck();
    }, interval);
    logger.info(`Health check started with interval ${interval}ms`);
  }

  stopHealthCheckInterval() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      logger.info('Health check stopped');
    }
  }

  async close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.stopHealthCheckInterval();
        this.db.close((err) => {
          if (err) {
            logger.error('Error closing database', { error: err.message });
            reject(err);
          } else {
            logger.info('Database connection closed');
            this.isConnected = false;
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  async backup() {
    try {
      const fs = require('fs');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(__dirname, `../../backups/trendaryo-${timestamp}.db`);
      
      const backupDir = path.dirname(backupPath);
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      await this.run(`VACUUM INTO '${backupPath}'`);
      logger.info('Database backup created', { path: backupPath });
      return backupPath;
    } catch (error) {
      logger.error('Database backup failed', { error: error.message });
      throw error;
    }
  }
}

module.exports = DatabaseManager;
