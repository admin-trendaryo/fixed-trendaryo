# CartManager Quick Reference

## For Developers: How to Add Cart Count Badge to Any Page

### Step 1: Include the Script
Add this line in your HTML `<head>` or before your main script:
```html
<script src="cart-manager.js"></script>
```

### Step 2: Add the Badge to Cart Icon
```html
<a href="cart.html" class="store-icon-btn" aria-label="Cart" style="position:relative;">
    🛒
    <span id="cart-count" style="position:absolute;top:-6px;right:-6px;min-width:18px;height:18px;padding:0 5px;border-radius:999px;background:var(--accent-2);color:#fff;font-size:0.7rem;font-weight:800;display:flex;align-items:center;justify-content:center;">0</span>
</a>
```

### Step 3: Initialize on Page Load
```javascript
window.addEventListener('load', () => {
    updateCartCountBadge();
    // ... other initialization code
});
```

### Step 4: Use CartManager for Cart Operations
```javascript
// Add item to cart
CartManager.addItem(productId, quantity);

// Remove item from cart
CartManager.removeItem(productId);

// Update item quantity
CartManager.updateQuantity(productId, newQuantity);

// Get current cart
const cart = CartManager.getCart();

// Get total item count
const count = CartManager.getCount();

// Clear entire cart
CartManager.clear();
```

## API Reference

### CartManager.addItem(productId, quantity = 1)
Adds an item to the cart or increases quantity if already exists.
```javascript
CartManager.addItem(5, 2);  // Add product 5 with quantity 2
```

### CartManager.removeItem(productId)
Removes an item completely from the cart.
```javascript
CartManager.removeItem(5);  // Remove product 5
```

### CartManager.updateQuantity(productId, quantity)
Updates the quantity of an existing item.
```javascript
CartManager.updateQuantity(5, 3);  // Set product 5 quantity to 3
```

### CartManager.getCart()
Returns the entire cart array.
```javascript
const cart = CartManager.getCart();
// Returns: [{ id: 1, quantity: 2 }, { id: 5, quantity: 3 }]
```

### CartManager.getCount()
Returns total number of items in cart.
```javascript
const count = CartManager.getCount();  // Returns: 5
```

### CartManager.clear()
Empties the entire cart.
```javascript
CartManager.clear();
```

## Event Listening

### Listen for Cart Updates
```javascript
window.addEventListener('cartUpdated', (event) => {
    console.log('Cart updated:', event.detail.cart);
    // Your code here
});
```

### Listen for Storage Changes (Multi-Tab)
```javascript
window.addEventListener('storage', () => {
    updateCartCountBadge();
});
```

## Common Patterns

### Add to Cart with Notification
```javascript
function addToCart(productId, productName) {
    CartManager.addItem(productId);
    showNotification(`✅ ${productName} added to cart!`, 'success');
}
```

### Remove from Cart
```javascript
function removeFromCart(productId) {
    CartManager.removeItem(productId);
    updateCartCountBadge();
}
```

### Update Cart Display
```javascript
function updateCartDisplay() {
    const cart = CartManager.getCart();
    const count = CartManager.getCount();
    
    document.getElementById('cart-count').textContent = count;
    document.getElementById('cart-items').innerHTML = cart.map(item => 
        `<div>${item.id} x ${item.quantity}</div>`
    ).join('');
}
```

## Storage Format

Cart is stored in localStorage as JSON:
```json
[
    { "id": 1, "quantity": 2 },
    { "id": 5, "quantity": 1 },
    { "id": 3, "quantity": 3 }
]
```

Key: `trendaryo_cart`

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Badge not showing | Ensure `#cart-count` element exists in HTML |
| Badge not updating | Check that `cart-manager.js` is loaded first |
| Count is wrong | Clear localStorage and refresh page |
| Events not firing | Check browser console for errors |
| Multi-tab sync not working | Ensure storage event listener is active |

## Pages Using CartManager

✅ shop.html - Add to cart from product cards
✅ product.html - Add to cart from product detail
✅ cart.html - Display and manage cart items

## Pages Ready for CartManager

These pages can easily add CartManager by following the 4 steps above:
- wishlist.html
- compare.html
- checkout.html
- search.html
- Any custom product page

## Performance Notes

- CartManager operations are O(n) where n = number of items in cart
- Typical carts have < 50 items, so performance is negligible
- localStorage operations are synchronous but very fast
- Custom events are dispatched immediately after cart update
- Badge updates happen within milliseconds

## Browser Compatibility

✅ Chrome/Edge 90+
✅ Firefox 88+
✅ Safari 14+
✅ Mobile browsers (iOS Safari, Chrome Mobile)

Requires:
- localStorage support
- CustomEvent support
- ES6 arrow functions
