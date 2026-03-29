/**
 * FRONTEND API INTEGRATION GUIDE
 * How to connect your frontend to the Trendaryo backend API
 */

// ============================================================================
// API CLIENT SETUP
// ============================================================================

class TrendaryoAPI {
  constructor(baseURL = 'http://localhost:3000/api') {
    this.baseURL = baseURL;
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  // ========================================================================
  // REQUEST HELPER
  // ========================================================================

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      // Handle token expiry
      if (response.status === 401) {
        await this.refreshAccessToken();
        return this.request(endpoint, options);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // ========================================================================
  // AUTHENTICATION
  // ========================================================================

  async register(email, password, firstName, lastName, phone) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName, phone })
    });

    this.setTokens(response.data.accessToken, response.data.refreshToken);
    return response.data;
  }

  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    this.setTokens(response.data.accessToken, response.data.refreshToken);
    return response.data;
  }

  async logout() {
    await this.request('/auth/logout', { method: 'POST' });
    this.clearTokens();
  }

  async refreshAccessToken() {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: this.refreshToken })
    });

    this.setTokens(response.data.accessToken, this.refreshToken);
    return response.data;
  }

  setTokens(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // ========================================================================
  // PRODUCTS
  // ========================================================================

  async getProducts(page = 1, limit = 20) {
    return this.request(`/products?page=${page}&limit=${limit}`);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, { method: 'DELETE' });
  }

  // ========================================================================
  // ORDERS
  // ========================================================================

  async createOrder(items, shippingAddress, paymentMethod) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify({ items, shippingAddress, paymentMethod })
    });
  }

  async getOrders(page = 1, limit = 20) {
    return this.request(`/orders?page=${page}&limit=${limit}`);
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  async updateOrder(id, status) {
    return this.request(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  // ========================================================================
  // CART
  // ========================================================================

  async addToCart(productId, quantity) {
    return this.request('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity })
    });
  }

  async getCart() {
    return this.request('/cart');
  }

  async removeFromCart(productId) {
    return this.request(`/cart/${productId}`, { method: 'DELETE' });
  }

  // ========================================================================
  // PAYMENTS
  // ========================================================================

  async processPayment(orderId, amount, currency, paymentMethod, token) {
    return this.request('/payments', {
      method: 'POST',
      body: JSON.stringify({ orderId, amount, currency, paymentMethod, token })
    });
  }

  async getPayment(id) {
    return this.request(`/payments/${id}`);
  }

  // ========================================================================
  // USER PROFILE
  // ========================================================================

  async getProfile() {
    return this.request('/users/profile');
  }

  async updateProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  // ========================================================================
  // ADMIN
  // ========================================================================

  async getStats() {
    return this.request('/admin/stats');
  }

  async getErrors(limit = 50) {
    return this.request(`/admin/errors?limit=${limit}`);
  }
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

// Initialize API client
const api = new TrendaryoAPI();

// Example: Register user
async function registerUser() {
  try {
    const user = await api.register(
      'user@example.com',
      'password123',
      'John',
      'Doe',
      '+1234567890'
    );
    console.log('User registered:', user);
  } catch (error) {
    console.error('Registration failed:', error);
  }
}

// Example: Login user
async function loginUser() {
  try {
    const user = await api.login('user@example.com', 'password123');
    console.log('User logged in:', user);
  } catch (error) {
    console.error('Login failed:', error);
  }
}

// Example: Get products
async function loadProducts() {
  try {
    const response = await api.getProducts(1, 20);
    console.log('Products:', response.data);
  } catch (error) {
    console.error('Failed to load products:', error);
  }
}

// Example: Add to cart
async function addProductToCart() {
  try {
    await api.addToCart('product-id', 1);
    console.log('Product added to cart');
  } catch (error) {
    console.error('Failed to add to cart:', error);
  }
}

// Example: Create order
async function createOrder() {
  try {
    const order = await api.createOrder(
      [{ productId: 'product-id', quantity: 1 }],
      {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'US'
      },
      'card'
    );
    console.log('Order created:', order);
  } catch (error) {
    console.error('Failed to create order:', error);
  }
}

// Example: Process payment
async function processPayment() {
  try {
    const payment = await api.processPayment(
      'order-id',
      99.99,
      'USD',
      'card',
      'stripe-token'
    );
    console.log('Payment processed:', payment);
  } catch (error) {
    console.error('Payment failed:', error);
  }
}

// ============================================================================
// INTEGRATION WITH EXISTING FRONTEND
// ============================================================================

// Update shop.html to use API
function updateShopPageWithAPI() {
  const api = new TrendaryoAPI();

  async function loadProducts() {
    try {
      const response = await api.getProducts();
      const grid = document.getElementById('products-grid');
      
      grid.innerHTML = response.data.map(product => `
        <div class="product-card" onclick="viewProduct('${product.id}')">
          <div class="product-image">${product.emoji}</div>
          <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">
              <span class="price">$${product.price}</span>
            </div>
            <div class="product-actions">
              <button class="btn-add-cart" onclick="addToCart('${product.id}')">Add to Cart</button>
            </div>
          </div>
        </div>
      `).join('');
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  }

  async function addToCart(productId) {
    try {
      await api.addToCart(productId, 1);
      alert('Product added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  }

  loadProducts();
}

// ============================================================================
// EXPORT
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = TrendaryoAPI;
}
