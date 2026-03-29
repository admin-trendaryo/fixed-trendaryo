/**
 * QUANTUM FLUX SHOP — Revolutionary Interactive Shopping Experience
 * Features: Floating Orbs, Magnetic Attraction, Holographic Cards, Particle Trails, Quantum Entanglement
 */

(function() {
  'use strict';

  const CONFIG = {
    products: [
      { id: 1, name: 'Wireless Headphones', price: 149, emoji: '🎧', badge: 'hot', desc: 'Premium sound quality with active noise cancellation' },
      { id: 2, name: 'Smart Fitness Band', price: 79, emoji: '⌚', badge: 'trending', desc: 'Track your health and fitness goals' },
      { id: 3, name: 'Designer Backpack', price: 199, emoji: '🎒', badge: 'premium', desc: 'Stylish and functional for everyday use' },
      { id: 4, name: 'Gaming Laptop', price: 1299, emoji: '💻', badge: 'premium', desc: 'High-performance with RTX graphics' },
      { id: 5, name: 'Wireless Earbuds', price: 89, emoji: '🎵', badge: 'trending', desc: 'True wireless with crystal clear sound' },
      { id: 6, name: 'Smart Watch', price: 299, emoji: '⌚', badge: 'hot', desc: 'Advanced health monitoring' },
      { id: 7, name: 'Premium Sneakers', price: 159, emoji: '👟', badge: 'trending', desc: 'Comfortable and stylish design' },
      { id: 8, name: 'Portable Speaker', price: 119, emoji: '🔊', badge: 'hot', desc: 'Waterproof with 360-degree sound' }
    ],
    animationDuration: 0.6,
    particleCount: 30
  };

  let state = {
    activeFilter: 'all',
    mouseX: 0,
    mouseY: 0,
    particles: [],
    productCards: []
  };

  // ═══ URL-BASED CATEGORY SUPPORT ═══
  function getInitialCategory() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    const validCategories = ['all', 'hot', 'trending', 'premium', 'new'];
    return validCategories.includes(category) ? category : 'all';
  }

  function updateCategoryURL(category) {
    const url = new URL(window.location);
    if (category === 'all') {
      url.searchParams.delete('category');
    } else {
      url.searchParams.set('category', category);
    }
    window.history.replaceState({}, '', url);
  }

  // ═══ 1. FLOATING PRODUCT ORBS ═══
  function initFloatingOrbs() {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
      const orb = document.createElement('div');
      orb.className = 'quantum-orb';
      orb.style.cssText = `
        position: absolute;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: radial-gradient(circle, #00f0ff, #ff00aa);
        box-shadow: 0 0 15px rgba(0,240,255,0.8);
        top: -15px;
        left: 50%;
        transform: translateX(-50%);
        pointer-events: none;
        z-index: 10;
        animation: orbFloat ${3 + index * 0.2}s ease-in-out infinite;
      `;
      card.style.position = 'relative';
      card.appendChild(orb);
    });

    // Add orbit animation
    if (!document.querySelector('style[data-quantum]')) {
      const style = document.createElement('style');
      style.setAttribute('data-quantum', 'true');
      style.textContent = `
        @keyframes orbFloat {
          0%, 100% { transform: translateX(-50%) translateY(0) scale(1); opacity: 0.6; }
          50% { transform: translateX(-50%) translateY(-20px) scale(1.2); opacity: 1; }
        }
        @keyframes orbPulse {
          0%, 100% { box-shadow: 0 0 15px rgba(0,240,255,0.8); }
          50% { box-shadow: 0 0 30px rgba(255,0,170,0.8), 0 0 50px rgba(0,240,255,0.4); }
        }
        @keyframes scanLine {
          0% { top: -100%; }
          100% { top: 100%; }
        }
        @keyframes holoPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes particleTrail {
          0% { opacity: 1; transform: translate(var(--tx), var(--ty)) scale(1); }
          100% { opacity: 0; transform: translate(calc(var(--tx) * 2), calc(var(--ty) * 2)) scale(0); }
        }
        @keyframes connectionPulse {
          0%, 100% { opacity: 0.3; stroke-width: 1px; }
          50% { opacity: 0.8; stroke-width: 2px; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ═══ 2. MAGNETIC PRODUCT ATTRACTION ═══
  function initMagneticAttraction() {
    const filterButtons = document.querySelectorAll('.filter-orb');
    const productGrid = document.getElementById('products-grid');

    filterButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        const filter = this.dataset.filter;
        state.activeFilter = filter;
        updateCategoryURL(filter);

        // Remove active class from all buttons
        filterButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        // Magnetic attraction animation
        const cards = document.querySelectorAll('.product-card');
        cards.forEach((card, index) => {
          const rect = card.getBoundingClientRect();
          const btnRect = this.getBoundingClientRect();
          
          // Calculate attraction vector
          const dx = btnRect.left - rect.left;
          const dy = btnRect.top - rect.top;
          
          // Animate to filter, then back
          card.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
          card.style.transform = `translate(${dx * 0.3}px, ${dy * 0.3}px) scale(0.95)`;
          
          setTimeout(() => {
            card.style.transform = 'translate(0, 0) scale(1)';
          }, 200);

          // Create particle burst
          createParticleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
        });

        // Filter products
        filterProducts(filter);
      });
    });
  }

  // ═══ 3. QUANTUM STATE TRANSITIONS ═══
  function initQuantumTransitions() {
    const viewBtns = document.querySelectorAll('.view-btn');
    const productGrid = document.getElementById('products-grid');

    viewBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const view = this.dataset.view;
        
        viewBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const cards = document.querySelectorAll('.product-card');
        
        if (view === 'grid') {
          productGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(320px, 1fr))';
        } else {
          productGrid.style.gridTemplateColumns = '1fr';
        }

        // Quantum morph animation
        cards.forEach((card, index) => {
          card.style.animation = 'none';
          setTimeout(() => {
            card.style.animation = `quantumMorph 0.6s ease-out ${index * 0.05}s`;
          }, 10);
        });
      });
    });

    // Add morph animation
    const style = document.querySelector('style[data-quantum]');
    if (style) {
      style.textContent += `
        @keyframes quantumMorph {
          0% { opacity: 0; transform: scale(0.8) rotateY(90deg); }
          50% { transform: scale(1.05) rotateY(45deg); }
          100% { opacity: 1; transform: scale(1) rotateY(0deg); }
        }
      `;
    }
  }

  // ═══ 4. INTERACTIVE PRICE VORTEX ═══
  function initPriceVortex() {
    const slider = document.getElementById('priceSlider');
    const maxPriceDisplay = document.getElementById('maxPrice');
    const productGrid = document.getElementById('products-grid');

    if (!slider) return;

    slider.addEventListener('input', function() {
      const maxPrice = parseInt(this.value);
      maxPriceDisplay.textContent = maxPrice;

      // Create vortex effect
      const rect = this.getBoundingClientRect();
      createVortexEffect(rect.left + rect.width / 2, rect.top + rect.height / 2);

      // Filter by price
      const cards = document.querySelectorAll('.product-card');
      cards.forEach(card => {
        const priceText = card.querySelector('.price').textContent;
        const price = parseInt(priceText.replace('$', ''));
        
        if (price <= maxPrice) {
          card.style.opacity = '1';
          card.style.pointerEvents = 'auto';
        } else {
          card.style.opacity = '0.3';
          card.style.pointerEvents = 'none';
        }
      });
    });
  }

  // ═══ 5. HOLOGRAPHIC PRODUCT CARDS ═══
  function initHolographicCards() {
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
      // Add holographic scan line
      const scanLine = document.createElement('div');
      scanLine.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, rgba(0,240,255,0.8), transparent);
        animation: scanLine 3s ease-in-out infinite;
        pointer-events: none;
        z-index: 5;
      `;
      card.appendChild(scanLine);

      // 3D flip on hover
      card.addEventListener('mouseenter', function() {
        this.style.perspective = '1000px';
        this.style.transformStyle = 'preserve-3d';
        
        const rect = this.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        document.addEventListener('mousemove', function onMouseMove(e) {
          const x = (e.clientX - centerX) / (rect.width / 2);
          const y = (e.clientY - centerY) / (rect.height / 2);
          
          card.style.transform = `rotateY(${x * 15}deg) rotateX(${-y * 15}deg)`;
        });

        card.addEventListener('mouseleave', function() {
          card.style.transform = 'rotateY(0) rotateX(0)';
          document.removeEventListener('mousemove', onMouseMove);
        }, { once: true });
      });

      // Holographic pulse
      const holoGlow = document.createElement('div');
      holoGlow.style.cssText = `
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 30% 30%, rgba(0,240,255,0.1), transparent 60%);
        animation: holoPulse 2s ease-in-out infinite;
        pointer-events: none;
        border-radius: 24px;
      `;
      card.appendChild(holoGlow);
    });
  }

  // ═══ 6. COSMIC SEARCH TRAIL ═══
  function initSearchTrail() {
    const searchInput = document.querySelector('.store-search input');
    if (!searchInput) return;

    searchInput.addEventListener('input', function(e) {
      const query = e.target.value.toLowerCase();
      
      if (query.length > 0) {
        // Create search particle trail
        const rect = searchInput.getBoundingClientRect();
        createSearchTrail(rect.left + rect.width / 2, rect.top + rect.height / 2, query);

        // Filter products
        const cards = document.querySelectorAll('.product-card');
        cards.forEach(card => {
          const name = card.querySelector('.product-name').textContent.toLowerCase();
          const desc = card.querySelector('.product-description').textContent.toLowerCase();
          
          if (name.includes(query) || desc.includes(query)) {
            card.style.opacity = '1';
            card.style.pointerEvents = 'auto';
            card.style.transform = 'scale(1)';
          } else {
            card.style.opacity = '0.2';
            card.style.pointerEvents = 'none';
            card.style.transform = 'scale(0.95)';
          }
        });
      } else {
        // Show all products
        const cards = document.querySelectorAll('.product-card');
        cards.forEach(card => {
          card.style.opacity = '1';
          card.style.pointerEvents = 'auto';
          card.style.transform = 'scale(1)';
        });
      }
    });
  }

  // ═══ 7. QUANTUM ENTANGLEMENT (Connection Lines) ═══
  function initQuantumEntanglement() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    `;
    document.body.appendChild(svg);

    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        const nextCard = cards[i + 1];
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('stroke', 'rgba(0,240,255,0.3)');
        line.setAttribute('stroke-width', '1');
        line.setAttribute('stroke-dasharray', '5,5');
        line.style.animation = 'connectionPulse 2s ease-in-out infinite';
        
        function updateLine() {
          const rect1 = card.getBoundingClientRect();
          const rect2 = nextCard.getBoundingClientRect();
          
          line.setAttribute('x1', rect1.left + rect1.width / 2);
          line.setAttribute('y1', rect1.top + rect1.height / 2);
          line.setAttribute('x2', rect2.left + rect2.width / 2);
          line.setAttribute('y2', rect2.top + rect2.height / 2);
        }
        
        svg.appendChild(line);
        updateLine();
        
        window.addEventListener('scroll', updateLine);
        window.addEventListener('resize', updateLine);
      }
    });
  }

  // ═══ 8. NEBULA SORTING ═══
  function initNebulaSorting() {
    const sortSelect = document.getElementById('sortSelect');
    if (!sortSelect) return;

    sortSelect.addEventListener('change', function() {
      const sortType = this.value;
      const grid = document.getElementById('products-grid');
      const cards = Array.from(document.querySelectorAll('.product-card'));

      // Create nebula effect
      createNebulaBurst(window.innerWidth / 2, window.innerHeight / 2);

      // Sort products
      cards.sort((a, b) => {
        const priceA = parseInt(a.querySelector('.price').textContent.replace('$', ''));
        const priceB = parseInt(b.querySelector('.price').textContent.replace('$', ''));

        switch(sortType) {
          case 'price-low':
            return priceA - priceB;
          case 'price-high':
            return priceB - priceA;
          default:
            return 0;
        }
      });

      // Animate reorganization
      cards.forEach((card, index) => {
        card.style.animation = 'none';
        setTimeout(() => {
          card.style.animation = `nebulaShuffle 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.05}s`;
          grid.appendChild(card);
        }, 10);
      });
    });

    // Add shuffle animation
    const style = document.querySelector('style[data-quantum]');
    if (style) {
      style.textContent += `
        @keyframes nebulaShuffle {
          0% { opacity: 0; transform: scale(0.5) rotate(180deg); }
          50% { transform: scale(1.1) rotate(90deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
      `;
    }
  }

  // ═══ PARTICLE EFFECTS ═══
  function createParticleBurst(x, y) {
    for (let i = 0; i < CONFIG.particleCount; i++) {
      const particle = document.createElement('div');
      const angle = (Math.PI * 2 * i) / CONFIG.particleCount;
      const velocity = 2 + Math.random() * 3;
      const tx = Math.cos(angle) * velocity * 50;
      const ty = Math.sin(angle) * velocity * 50;

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

  function createVortexEffect(x, y) {
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      const angle = Math.random() * Math.PI * 2;
      const distance = 30 + Math.random() * 50;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 3px;
        height: 3px;
        border-radius: 50%;
        background: #ff00aa;
        box-shadow: 0 0 8px rgba(255,0,170,0.8);
        pointer-events: none;
        z-index: 100;
        --tx: ${tx}px;
        --ty: ${ty}px;
        animation: particleTrail 0.6s ease-out forwards;
      `;

      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 600);
    }
  }

  function createSearchTrail(x, y, query) {
    const colors = ['#00f0ff', '#ff00aa', '#00ff88'];
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      const angle = Math.random() * Math.PI * 2;
      const distance = 20 + Math.random() * 40;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const color = colors[Math.floor(Math.random() * colors.length)];

      particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 2px;
        height: 2px;
        border-radius: 50%;
        background: ${color};
        box-shadow: 0 0 6px ${color};
        pointer-events: none;
        z-index: 100;
        --tx: ${tx}px;
        --ty: ${ty}px;
        animation: particleTrail 0.7s ease-out forwards;
      `;

      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 700);
    }
  }

  function createNebulaBurst(x, y) {
    for (let i = 0; i < 40; i++) {
      const particle = document.createElement('div');
      const angle = (Math.PI * 2 * i) / 40;
      const velocity = 3 + Math.random() * 4;
      const tx = Math.cos(angle) * velocity * 60;
      const ty = Math.sin(angle) * velocity * 60;

      particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: radial-gradient(circle, #00ff88, #00f0ff);
        box-shadow: 0 0 15px rgba(0,255,136,0.8);
        pointer-events: none;
        z-index: 100;
        --tx: ${tx}px;
        --ty: ${ty}px;
        animation: particleTrail 1s ease-out forwards;
      `;

      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 1000);
    }
  }

  function filterProducts(filter) {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
      const badge = card.querySelector('.product-badge').className.split(' ')[1];
      
      if (filter === 'all' || badge === filter) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // ═══ INITIALIZATION ═══
  function init() {
    initFloatingOrbs();
    initMagneticAttraction();
    initQuantumTransitions();
    initPriceVortex();
    initHolographicCards();
    initSearchTrail();
    initQuantumEntanglement();
    initNebulaSorting();

    // Apply initial category from URL
    const initialCategory = getInitialCategory();
    if (initialCategory !== 'all') {
      state.activeFilter = initialCategory;
      const filterBtn = document.querySelector(`[data-filter="${initialCategory}"]`);
      if (filterBtn) {
        filterBtn.classList.add('active');
        filterProducts(initialCategory);
      }
    }
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
