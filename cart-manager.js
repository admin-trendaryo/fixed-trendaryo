// Global Cart Manager - Works across all pages
const CartManager = {
    STORAGE_KEY: 'trendaryo_cart',
    
    getCart() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    },
    
    addItem(productId, quantity = 1) {
        const cart = this.getCart();
        const existingItem = cart.find(item => (typeof item === 'number' ? item : item.id) === productId);
        
        if (existingItem) {
            if (typeof existingItem === 'number') {
                const idx = cart.indexOf(existingItem);
                cart[idx] = { id: productId, quantity: quantity + 1 };
            } else {
                existingItem.quantity = (existingItem.quantity || 1) + quantity;
            }
        } else {
            cart.push({ id: productId, quantity });
        }
        
        this.saveCart(cart);
        return cart;
    },
    
    removeItem(productId) {
        const cart = this.getCart().filter(item => (typeof item === 'number' ? item : item.id) !== productId);
        this.saveCart(cart);
        return cart;
    },
    
    updateQuantity(productId, quantity) {
        const cart = this.getCart();
        const item = cart.find(item => (typeof item === 'number' ? item : item.id) === productId);
        
        if (item) {
            if (typeof item === 'number') {
                const idx = cart.indexOf(item);
                cart[idx] = { id: productId, quantity };
            } else {
                item.quantity = quantity;
            }
            this.saveCart(cart);
        }
        return cart;
    },
    
    saveCart(cart) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
        this.notifyUpdate();
    },
    
    getCount() {
        return this.getCart().reduce((sum, item) => {
            return sum + (typeof item === 'number' ? 1 : (item.quantity || 1));
        }, 0);
    },
    
    notifyUpdate() {
        // Dispatch custom event for cart updates
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: this.getCart() } }));
    },
    
    clear() {
        this.saveCart([]);
    }
};

// Auto-update cart count badge on all pages
function updateCartCountBadge() {
    const badge = document.getElementById('cart-count');
    if (badge) {
        badge.textContent = CartManager.getCount();
    }
}

// Listen for cart updates
window.addEventListener('cartUpdated', updateCartCountBadge);
window.addEventListener('storage', updateCartCountBadge);

// Update on page load
document.addEventListener('DOMContentLoaded', updateCartCountBadge);
