/**
 * QUANTUM PARTICLE CART — Revolutionary 3D Interactive Shopping Experience
 * Features: Floating 3D Particles, Physics Simulation, Drag-Drop, Holographic Previews
 */

(function() {
  'use strict';

  const CONFIG = {
    particleRadius: 60,
    particleCount: 0,
    gravity: 0.15,
    friction: 0.98,
    bounce: 0.6,
    centerForce: 0.02,
    maxVelocity: 8,
    particleSpacing: 150
  };

  let state = {
    particles: [],
    selectedParticle: null,
    isDragging: false,
    dragOffset: { x: 0, y: 0 },
    mouseX: 0,
    mouseY: 0,
    canvas: null,
    ctx: null,
    animationId: null,
    cart: [],
    totalPrice: 0
  };

  // ═══ PARTICLE CLASS ═══
  class Particle {
    constructor(id, name, price, emoji, x, y) {
      this.id = id;
      this.name = name;
      this.price = price;
      this.emoji = emoji;
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 4;
      this.vy = (Math.random() - 0.5) * 4;
      this.radius = CONFIG.particleRadius;
      this.mass = 1;
      this.hovered = false;
      this.quantity = 1;
      this.glowIntensity = 0.5;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.05;
    }

    update(width, height) {
      // Apply gravity
      this.vy += CONFIG.gravity;

      // Apply center attraction force
      const centerX = width / 2;
      const centerY = height / 2;
      const dx = centerX - this.x;
      const dy = centerY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 100) {
        this.vx += (dx / distance) * CONFIG.centerForce;
        this.vy += (dy / distance) * CONFIG.centerForce;
      }

      // Apply friction
      this.vx *= CONFIG.friction;
      this.vy *= CONFIG.friction;

      // Limit velocity
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > CONFIG.maxVelocity) {
        this.vx = (this.vx / speed) * CONFIG.maxVelocity;
        this.vy = (this.vy / speed) * CONFIG.maxVelocity;
      }

      // Update position
      this.x += this.vx;
      this.y += this.vy;

      // Boundary collision
      if (this.x - this.radius < 0) {
        this.x = this.radius;
        this.vx *= -CONFIG.bounce;
      }
      if (this.x + this.radius > width) {
        this.x = width - this.radius;
        this.vx *= -CONFIG.bounce;
      }
      if (this.y - this.radius < 0) {
        this.y = this.radius;
        this.vy *= -CONFIG.bounce;
      }
      if (this.y + this.radius > height) {
        this.y = height - this.radius;
        this.vy *= -CONFIG.bounce;
      }

      // Update rotation
      this.rotation += this.rotationSpeed;

      // Update glow
      if (this.hovered) {
        this.glowIntensity = Math.min(1, this.glowIntensity + 0.05);
      } else {
        this.glowIntensity = Math.max(0.5, this.glowIntensity - 0.02);
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      // Draw glow
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius + 20);
      gradient.addColorStop(0, `rgba(0, 240, 255, ${this.glowIntensity * 0.6})`);
      gradient.addColorStop(0.5, `rgba(255, 0, 170, ${this.glowIntensity * 0.3})`);
      gradient.addColorStop(1, 'rgba(0, 240, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 20, 0, Math.PI * 2);
      ctx.fill();

      // Draw particle body
      const bodyGradient = ctx.createRadialGradient(-10, -10, 0, 0, 0, this.radius);
      bodyGradient.addColorStop(0, 'rgba(0, 240, 255, 0.9)');
      bodyGradient.addColorStop(0.7, 'rgba(255, 0, 170, 0.7)');
      bodyGradient.addColorStop(1, 'rgba(0, 255, 136, 0.5)');
      
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw border
      ctx.strokeStyle = `rgba(0, 240, 255, ${this.glowIntensity})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw emoji
      ctx.rotate(-this.rotation);
      ctx.font = `${this.radius * 1.2}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff';
      ctx.fillText(this.emoji, 0, 0);

      // Draw quantity badge
      if (this.quantity > 1) {
        ctx.fillStyle = 'rgba(255, 0, 170, 0.9)';
        ctx.beginPath();
        ctx.arc(this.radius * 0.6, -this.radius * 0.6, 15, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(this.quantity, this.radius * 0.6, -this.radius * 0.6);
      }

      ctx.restore();
    }

    contains(x, y) {
      const dx = x - this.x;
      const dy = y - this.y;
      return Math.sqrt(dx * dx + dy * dy) < this.radius;
    }
  }

  // ═══ PARTICLE COLLISION ═══
  function checkCollisions() {
    for (let i = 0; i < state.particles.length; i++) {
      for (let j = i + 1; j < state.particles.length; j++) {
        const p1 = state.particles[i];
        const p2 = state.particles[j];
        
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = p1.radius + p2.radius;

        if (distance < minDistance) {
          // Collision detected
          const angle = Math.atan2(dy, dx);
          const sin = Math.sin(angle);
          const cos = Math.cos(angle);

          // Swap velocities
          const vx1 = p1.vx * cos + p1.vy * sin;
          const vy1 = p1.vy * cos - p1.vx * sin;
          const vx2 = p2.vx * cos + p2.vy * sin;
          const vy2 = p2.vy * cos - p2.vx * sin;

          p1.vx = vx2 * cos - vy1 * sin;
          p1.vy = vy1 * cos + vx2 * sin;
          p2.vx = vx1 * cos - vy2 * sin;
          p2.vy = vy2 * cos + vx1 * sin;

          // Separate particles
          const overlap = (minDistance - distance) / 2;
          p1.x -= overlap * cos;
          p1.y -= overlap * sin;
          p2.x += overlap * cos;
          p2.y += overlap * sin;
        }
      }
    }
  }

  // ═══ DRAW CONNECTIONS ═══
  function drawConnections(ctx) {
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    for (let i = 0; i < state.particles.length; i++) {
      for (let j = i + 1; j < Math.min(i + 3, state.particles.length); j++) {
        const p1 = state.particles[i];
        const p2 = state.particles[j];
        
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }

    ctx.setLineDash([]);
  }

  // ═══ ANIMATION LOOP ═══
  function animate() {
    const canvas = state.canvas;
    const ctx = state.ctx;
    
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update particles
    state.particles.forEach(particle => {
      particle.update(canvas.width, canvas.height);
    });

    // Check collisions
    checkCollisions();

    // Draw connections
    drawConnections(ctx);

    // Draw particles
    state.particles.forEach(particle => {
      particle.draw(ctx);
    });

    // Draw center point
    ctx.fillStyle = 'rgba(0, 240, 255, 0.1)';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 5, 0, Math.PI * 2);
    ctx.fill();

    state.animationId = requestAnimationFrame(animate);
  }

  // ═══ MOUSE EVENTS ═══
  function setupMouseEvents() {
    const canvas = state.canvas;
    if (!canvas) return;

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      state.mouseX = e.clientX - rect.left;
      state.mouseY = e.clientY - rect.top;

      // Check hover
      state.particles.forEach(particle => {
        particle.hovered = particle.contains(state.mouseX, state.mouseY);
      });

      // Update dragging
      if (state.isDragging && state.selectedParticle) {
        state.selectedParticle.x = state.mouseX + state.dragOffset.x;
        state.selectedParticle.y = state.mouseY + state.dragOffset.y;
        state.selectedParticle.vx = 0;
        state.selectedParticle.vy = 0;
      }
    });

    canvas.addEventListener('mousedown', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (let i = state.particles.length - 1; i >= 0; i--) {
        if (state.particles[i].contains(x, y)) {
          state.selectedParticle = state.particles[i];
          state.isDragging = true;
          state.dragOffset.x = state.selectedParticle.x - x;
          state.dragOffset.y = state.selectedParticle.y - y;
          break;
        }
      }
    });

    canvas.addEventListener('mouseup', () => {
      state.isDragging = false;
      state.selectedParticle = null;
    });

    canvas.addEventListener('mouseleave', () => {
      state.isDragging = false;
      state.selectedParticle = null;
      state.particles.forEach(p => p.hovered = false);
    });

    // Double-click to remove
    canvas.addEventListener('dblclick', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (let i = 0; i < state.particles.length; i++) {
        if (state.particles[i].contains(x, y)) {
          removeParticle(state.particles[i].id);
          break;
        }
      }
    });
  }

  // ═══ PARTICLE MANAGEMENT ═══
  function addParticle(id, name, price, emoji, quantity = 1) {
    const canvas = state.canvas;
    if (!canvas) return;

    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 100;
    const x = canvas.width / 2 + Math.cos(angle) * distance;
    const y = canvas.height / 2 + Math.sin(angle) * distance;

    const particle = new Particle(id, name, price, emoji, x, y);
    particle.quantity = quantity;
    state.particles.push(particle);
    updateTotal();
  }

  function removeParticle(id) {
    const index = state.particles.findIndex(p => p.id === id);
    if (index !== -1) {
      const particle = state.particles[index];
      
      // Explosion effect
      createExplosion(particle.x, particle.y);
      
      state.particles.splice(index, 1);
      updateTotal();
      updateCartStorage();
    }
  }

  function createExplosion(x, y) {
    const canvas = state.canvas;
    if (!canvas) return;

    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 * i) / 20;
      const velocity = 3 + Math.random() * 3;
      const tx = Math.cos(angle) * velocity * 30;
      const ty = Math.sin(angle) * velocity * 30;

      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: radial-gradient(circle, #00f0ff, #ff00aa);
        box-shadow: 0 0 10px rgba(0,240,255,0.8);
        pointer-events: none;
        z-index: 100;
        --tx: ${tx}px;
        --ty: ${ty}px;
        animation: particleTrail 0.8s ease-out forwards;
      `;

      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 800);
    }
  }

  function updateQuantity(id, change) {
    const particle = state.particles.find(p => p.id === id);
    if (particle) {
      particle.quantity = Math.max(1, particle.quantity + change);
      updateTotal();
      updateCartStorage();
    }
  }

  function updateTotal() {
    state.totalPrice = state.particles.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const totalEl = document.getElementById('quantum-total');
    if (totalEl) {
      totalEl.textContent = `$${state.totalPrice.toFixed(2)}`;
    }
  }

  function updateCartStorage() {
    const cart = state.particles.map(p => ({ id: p.id, quantity: p.quantity }));
    localStorage.setItem('trendaryo_cart', JSON.stringify(cart));
  }

  // ═══ INITIALIZATION ═══
  function init() {
    const container = document.getElementById('quantum-particle-container');
    if (!container) return;

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    canvas.style.cssText = `
      display: block;
      width: 100%;
      height: 100%;
      background: transparent !important;
      cursor: grab;
      opacity: 0.95;
    `;
    container.appendChild(canvas);

    state.canvas = canvas;
    state.ctx = canvas.getContext('2d');

    // Load cart from localStorage
    const cart = JSON.parse(localStorage.getItem('trendaryo_cart') || '[]');
    const products = getProducts();

    // Add particles for each cart item
    const itemCounts = {};
    cart.forEach(item => {
      const id = typeof item === 'number' ? item : item.id;
      const qty = typeof item === 'number' ? 1 : (item.quantity || 1);
      itemCounts[id] = (itemCounts[id] || 0) + qty;
    });

    Object.entries(itemCounts).forEach(([productId, quantity]) => {
      const product = products.find(p => p.id === parseInt(productId));
      if (product) {
        addParticle(product.id, product.name, product.price, product.emoji, quantity);
      }
    });

    // Setup events
    setupMouseEvents();

    // Start animation
    animate();

    // Handle resize
    window.addEventListener('resize', () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    });
  }

  function getProducts() {
    return [
      { id: 1, name: 'Wireless Headphones', price: 149, emoji: '🎧' },
      { id: 2, name: 'Smart Fitness Band', price: 79, emoji: '⌚' },
      { id: 3, name: 'Designer Backpack', price: 199, emoji: '🎒' },
      { id: 4, name: 'Gaming Laptop', price: 1299, emoji: '💻' },
      { id: 5, name: 'Wireless Earbuds', price: 89, emoji: '🎵' },
      { id: 6, name: 'Smart Watch', price: 299, emoji: '⌚' },
      { id: 7, name: 'Premium Sneakers', price: 159, emoji: '👟' },
      { id: 8, name: 'Portable Speaker', price: 119, emoji: '🔊' }
    ];
  }

  // Expose public API
  window.QuantumParticleCart = {
    addParticle,
    removeParticle,
    updateQuantity,
    getParticles: () => state.particles,
    getTotal: () => state.totalPrice
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
