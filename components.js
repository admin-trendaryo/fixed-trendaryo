/**
 * TRENDARYO — Shared Header & Footer Component
 * Include this script in every page for consistent header/footer.
 * It auto-injects both components and handles all nav interactions.
 */
(function () {
    'use strict';

    /* ── Detect current page for active nav link ── */
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    function isActive(href) {
        return currentPage === href ? 'aria-current="page"' : '';
    }

    /* ── Header HTML ── */
    const headerHTML = `
    <header class="store-header" id="store-header">
        <div class="announcement-bar">
            🚀 FREE SHIPPING ON ORDERS OVER $50 &nbsp;|&nbsp; USE CODE <strong>WELCOME10</strong> FOR 10% OFF YOUR FIRST ORDER 🎉
        </div>
        <div class="store-header-inner">
            <div class="store-brand">
                <a href="index.html" class="store-logo">TRENDARYO</a>
            </div>

            <div class="store-search" role="search">
                <span aria-hidden="true" style="font-size:1rem;">🔎</span>
                <input type="search" id="header-search-input" placeholder="Search products..." autocomplete="off" />
            </div>

            <div class="store-actions">
                <a href="wishlist.html" class="store-icon-btn" aria-label="Wishlist" title="Wishlist">❤</a>
                <a href="compare.html" class="store-icon-btn" aria-label="Compare" title="Compare">⇄</a>
                <a href="cart.html" class="store-icon-btn" aria-label="Cart" title="Cart">
                    🛒
                    <span class="badge" id="cart-badge" style="display:none;">0</span>
                </a>
                <a href="account.html" class="store-icon-btn" aria-label="Account" title="Account">👤</a>
                <button class="store-mobile-toggle" id="store-mobile-toggle" aria-label="Toggle menu" aria-expanded="false">☰</button>
                <button id="theme-toggle" class="store-icon-btn" aria-label="Switch theme" title="Switch theme">🎨</button>
            </div>
        </div>

        <nav class="store-nav" aria-label="Primary navigation">
            <ul class="store-nav-list">
                <li class="store-nav-item">
                    <a href="index.html" class="store-nav-link" ${isActive('index.html')}>Home</a>
                </li>

                <li class="store-nav-item" data-dropdown>
                    <a href="shop.html" class="store-nav-link" ${isActive('shop.html')}>
                        Shop <span class="store-caret" aria-hidden="true">▾</span>
                    </a>
                    <div class="store-dropdown" role="menu">
                        <a href="shop.html">Shop All <small>Browse everything</small></a>
                        <a href="product.html">Product Page <small>Example product</small></a>
                        <a href="wishlist.html">Wishlist <small>Saved items</small></a>
                        <a href="compare.html">Compare <small>Side-by-side</small></a>
                        <a href="advanced-search.html">Advanced Search <small>Filter & find</small></a>
                    </div>
                </li>

                <li class="store-nav-item" data-dropdown>
                    <a href="cart.html" class="store-nav-link" ${isActive('cart.html')}>
                        Cart <span class="store-caret" aria-hidden="true">▾</span>
                    </a>
                    <div class="store-dropdown" role="menu">
                        <a href="cart.html">View Cart <small>Items & totals</small></a>
                        <a href="checkout.html">Checkout <small>Complete purchase</small></a>
                        <a href="track-order.html">Track Order <small>Shipping status</small></a>
                        <a href="orders.html">My Orders <small>Order history</small></a>
                    </div>
                </li>

                <li class="store-nav-item" data-dropdown>
                    <a href="account.html" class="store-nav-link" ${isActive('account.html')}>
                        Account <span class="store-caret" aria-hidden="true">▾</span>
                    </a>
                    <div class="store-dropdown" role="menu">
                        <a href="account.html">My Account <small>Profile & settings</small></a>
                        <a href="login.html">Login <small>Access account</small></a>
                        <a href="register.html">Register <small>Create account</small></a>
                        <a href="rewards.html">Rewards <small>Points & perks</small></a>
                    </div>
                </li>

                <li class="store-nav-item" data-dropdown>
                    <a href="faq.html" class="store-nav-link" ${isActive('faq.html')}>
                        Support <span class="store-caret" aria-hidden="true">▾</span>
                    </a>
                    <div class="store-dropdown" role="menu">
                        <a href="faq.html">FAQ <small>Common questions</small></a>
                        <a href="contact.html">Contact <small>Get in touch</small></a>
                        <a href="shipping.html">Shipping <small>Delivery info</small></a>
                        <a href="returns.html">Returns <small>Return policy</small></a>
                        <a href="help-center.html">Help Center <small>Full support hub</small></a>
                    </div>
                </li>

                <li class="store-nav-item" data-dropdown>
                    <a href="#" class="store-nav-link">
                        Services <span class="store-caret" aria-hidden="true">▾</span>
                    </a>
                    <div class="store-dropdown" role="menu">
                        <a href="size-guide.html">Size Guide <small>Find your fit</small></a>
                        <a href="gift-cards.html">Gift Cards <small>Perfect gift</small></a>
                        <a href="affiliate.html">Affiliate Program <small>Earn rewards</small></a>
                        <a href="refund.html">Refund Policy <small>Money back</small></a>
                    </div>
                </li>

                <li class="store-nav-item">
                    <a href="about.html" class="store-nav-link" ${isActive('about.html')}>About</a>
                </li>
                <li class="store-nav-item">
                    <a href="contact.html" class="store-nav-link" ${isActive('contact.html')}>Contact</a>
                </li>
                <li class="store-nav-item">
                    <a href="blog.html" class="store-nav-link" ${isActive('blog.html')}>Blog</a>
                </li>
            </ul>
        </nav>
    </header>`;

    /* ── Footer HTML ── */
    const footerHTML = `
    <footer class="site-footer">
        <div class="footer-newsletter">
            <div class="footer-newsletter-inner">
                <div class="footer-newsletter-text">📧 STAY IN THE LOOP — EXCLUSIVE DEALS & NEW ARRIVALS</div>
                <form class="footer-newsletter-form" onsubmit="return false;">
                    <input type="email" placeholder="Enter your email address" aria-label="Email for newsletter" />
                    <button type="submit">SUBSCRIBE</button>
                </form>
            </div>
        </div>

        <div class="footer-top">
            <div class="footer-brand-col">
                <span class="footer-logo-text">TRENDARYO</span>
                <span class="footer-company-name">TRENDARYO LLC</span>
                <span class="footer-owner">Owner: Bashir Khan Momand</span>
                <div class="footer-address">
                    House 124, Way 122, Al Maabela<br>
                    Wilayat Al Seeb, Muscat Governorate<br>
                    OMAN
                </div>
                <div class="footer-contact">
                    <strong>Email:</strong> <a href="mailto:admin@trendaryo.com">admin@trendaryo.com</a><br>
                    <strong>Phone:</strong> <a href="tel:+13075334512">+1 (307) 533-4512</a>
                </div>
                <p>Your premium destination for electronics, fashion, and accessories. Experience the future of shopping with our cutting-edge 3D platform.</p>
                <div class="footer-social">
                    <a href="https://www.facebook.com/trendaryo" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook">📘</a>
                    <a href="https://twitter.com/trendaryo" target="_blank" rel="noopener noreferrer" aria-label="Twitter" title="Twitter">🐦</a>
                    <a href="https://www.instagram.com/trendaryo" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram">📸</a>
                    <a href="https://www.linkedin.com/company/trendaryo" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn">💼</a>
                    <a href="https://www.youtube.com/@trendaryo" target="_blank" rel="noopener noreferrer" aria-label="YouTube" title="YouTube">▶️</a>
                </div>
            </div>

            <div class="footer-col">
                <h4>Shop</h4>
                <ul>
                    <li><a href="shop.html">All Products</a></li>
                    <li><a href="product.html">Featured Item</a></li>
                    <li><a href="wishlist.html">Wishlist</a></li>
                    <li><a href="compare.html">Compare</a></li>
                    <li><a href="advanced-search.html">Advanced Search</a></li>
                    <li><a href="gift-cards.html">Gift Cards</a></li>
                </ul>
            </div>

            <div class="footer-col">
                <h4>Account</h4>
                <ul>
                    <li><a href="account.html">My Account</a></li>
                    <li><a href="orders.html">My Orders</a></li>
                    <li><a href="track-order.html">Track Order</a></li>
                    <li><a href="rewards.html">Rewards</a></li>
                    <li><a href="login.html">Login</a></li>
                    <li><a href="register.html">Register</a></li>
                </ul>
            </div>

            <div class="footer-col">
                <h4>Support</h4>
                <ul>
                    <li><a href="faq.html">FAQ</a></li>
                    <li><a href="contact.html">Contact Us</a></li>
                    <li><a href="shipping.html">Shipping Info</a></li>
                    <li><a href="returns.html">Returns</a></li>
                    <li><a href="refund.html">Refund Policy</a></li>
                    <li><a href="help-center.html">Help Center</a></li>
                </ul>
            </div>

            <div class="footer-col">
                <h4>Company</h4>
                <ul>
                    <li><a href="about.html">About Us</a></li>
                    <li><a href="blog.html">Blog</a></li>
                    <li><a href="affiliate.html">Affiliate Program</a></li>
                    <li><a href="size-guide.html">Size Guide</a></li>
                    <li><a href="privacy.html">Privacy Policy</a></li>
                    <li><a href="terms.html">Terms of Service</a></li>
                </ul>
            </div>
        </div>

        <div class="footer-bottom">
            <p>&copy; ${new Date().getFullYear()} TRENDARYO LLC. All rights reserved. Owner: Bashir Khan Momand</p>
            <div class="footer-bottom-links">
                <a href="privacy.html">Privacy</a>
                <a href="terms.html">Terms</a>
                <a href="cookie-policy.html">Cookies</a>
                <a href="sitemap.xml">Sitemap</a>
            </div>
        </div>
    </footer>`;

    /* ── Inject header before body content ── */
    function injectHeader() {
        // Don't inject if already exists (e.g. index.html has its own)
        if (document.getElementById('store-header')) return;
        const wrapper = document.createElement('div');
        wrapper.innerHTML = headerHTML;
        document.body.insertBefore(wrapper.firstElementChild, document.body.firstChild);
    }

    /* ── Inject footer at end of body ── */
    function injectFooter() {
        if (document.querySelector('.site-footer')) return;
        const wrapper = document.createElement('div');
        wrapper.innerHTML = footerHTML;
        document.body.appendChild(wrapper.firstElementChild);
    }

    /* ── Nav interactions ── */
    function initNav() {
        const header = document.getElementById('store-header');
        const mobileToggle = document.getElementById('store-mobile-toggle');
        const dropdownItems = Array.from(document.querySelectorAll('.store-nav-item[data-dropdown]'));

        if (!header) return;

        // Mobile menu toggle
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                const isOpen = header.classList.toggle('is-open');
                mobileToggle.setAttribute('aria-expanded', String(isOpen));
                mobileToggle.textContent = isOpen ? '✕' : '☰';
                if (!isOpen) dropdownItems.forEach(i => i.classList.remove('is-open'));
            });
        }

        // Mobile dropdown tap-to-open
        dropdownItems.forEach(item => {
            const link = item.querySelector('.store-nav-link');
            if (!link) return;
            link.addEventListener('click', (e) => {
                if (!window.matchMedia('(max-width: 900px)').matches) return;
                if (!item.classList.contains('is-open')) {
                    e.preventDefault();
                    dropdownItems.forEach(i => i.classList.remove('is-open'));
                    item.classList.add('is-open');
                }
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (header.contains(e.target)) return;
            dropdownItems.forEach(i => i.classList.remove('is-open'));
            header.classList.remove('is-open');
            if (mobileToggle) {
                mobileToggle.setAttribute('aria-expanded', 'false');
                mobileToggle.textContent = '☰';
            }
        });

        // Scroll: add .scrolled class for enhanced shadow
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 40);
        }, { passive: true });
    }

    /* ── Header search ── */
    function initSearch() {
        const input = document.getElementById('header-search-input');
        if (!input) return;
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                window.location.href = `search.html?q=${encodeURIComponent(input.value.trim())}`;
            }
        });
    }

    /* ── Theme toggle (8 themes) ── */
    function initTheme() {
        const themes = [
            { name: 'Cyber Blue',    bg: 'linear-gradient(180deg,#0a0a2a,#1a1a40)',  accent: '#00f0ff', accent2: '#ff00aa', accent3: '#00ff88' },
            { name: 'Neon Purple',   bg: 'linear-gradient(180deg,#1a0033,#2d0052)',  accent: '#bf00ff', accent2: '#ff00ff', accent3: '#00ffff' },
            { name: 'Matrix Green',  bg: 'linear-gradient(180deg,#001a00,#003300)',  accent: '#00ff41', accent2: '#39ff14', accent3: '#00ff88' },
            { name: 'Sunset Orange', bg: 'linear-gradient(180deg,#1a0a00,#331400)',  accent: '#ff6b35', accent2: '#ff9f1c', accent3: '#ffbf69' },
            { name: 'Ocean Teal',    bg: 'linear-gradient(180deg,#001a1a,#003333)',  accent: '#00d9ff', accent2: '#00ffcc', accent3: '#00ff99' },
            { name: 'Royal Gold',    bg: 'linear-gradient(180deg,#1a1200,#332400)',  accent: '#ffd700', accent2: '#ffaa00', accent3: '#ff8c00' },
            { name: 'Crimson Red',   bg: 'linear-gradient(180deg,#1a0000,#330000)',  accent: '#ff0055', accent2: '#ff3366', accent3: '#ff6699' },
            { name: 'Arctic Ice',    bg: 'linear-gradient(180deg,#0a1a2a,#142840)',  accent: '#00d4ff', accent2: '#66e0ff', accent3: '#99ebff' },
        ];

        let idx = parseInt(localStorage.getItem('trendaryo_theme') || '0');

        function applyTheme(t) {
            // Ensure background div exists
            let bgDiv = document.getElementById('__theme-bg');
            if (!bgDiv) {
                bgDiv = document.createElement('div');
                bgDiv.id = '__theme-bg';
                bgDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-2;pointer-events:none;transition:background 0.6s ease;';
                document.body.insertBefore(bgDiv, document.body.firstChild);
            }
            window.__themeBgDiv = bgDiv;
            bgDiv.style.background = t.bg;
            document.documentElement.style.setProperty('--accent', t.accent);
            document.documentElement.style.setProperty('--accent-2', t.accent2);
            document.documentElement.style.setProperty('--accent-3', t.accent3);

            // Notify other systems
            if (window.unifiedBackground?.updateThemeColors) window.unifiedBackground.updateThemeColors(t);
            if (typeof updateParticlesTheme === 'function') updateParticlesTheme(t);

            // Toast notification
            showToast('🎨 ' + t.name);
        }

        function showToast(msg) {
            const existing = document.getElementById('theme-toast');
            if (existing) existing.remove();
            const toast = document.createElement('div');
            toast.id = 'theme-toast';
            toast.style.cssText = `
                position:fixed; top:90px; right:20px; z-index:99999;
                background:rgba(0,0,0,0.9); border:1px solid var(--accent);
                color:#fff; padding:0.75rem 1.25rem; border-radius:12px;
                font-family:'Orbitron',sans-serif; font-size:0.82rem; font-weight:700;
                backdrop-filter:blur(20px); box-shadow:0 0 30px rgba(0,240,255,0.2);
                animation:toastIn 0.3s ease;
            `;
            toast.textContent = msg;
            document.body.appendChild(toast);
            setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 2000);
        }

        // Add toast animation
        const s = document.createElement('style');
        s.textContent = '@keyframes toastIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}';
        document.head.appendChild(s);

        applyTheme(themes[idx]);

        const btn = document.getElementById('theme-toggle');
        if (btn) {
            btn.addEventListener('click', () => {
                idx = (idx + 1) % themes.length;
                localStorage.setItem('trendaryo_theme', idx);
                applyTheme(themes[idx]);
            });
        }
    }

    /* ── Cart badge from localStorage ── */
    function initCartBadge() {
        const badge = document.getElementById('cart-badge');
        if (!badge) return;
        try {
            const cart = JSON.parse(localStorage.getItem('trendaryo_cart') || '[]');
            const count = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
            if (count > 0) {
                badge.textContent = count > 99 ? '99+' : count;
                badge.style.display = 'flex';
            }
        } catch (e) { /* ignore */ }
    }

    /* ── Preloader hide ── */
    function initPreloader() {
        function hide() {
            const p = document.getElementById('preloader');
            if (p) p.classList.add('hidden');
        }
        if (document.readyState === 'complete') {
            setTimeout(hide, 800);
        } else {
            window.addEventListener('load', () => setTimeout(hide, 800));
        }
        setTimeout(hide, 2500); // failsafe
    }

    /* ── Newsletter form ── */
    function initNewsletter() {
        const form = document.querySelector('.footer-newsletter-form');
        if (!form) return;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = form.querySelector('input[type="email"]');
            if (input && input.value.trim()) {
                input.value = '';
                const btn = form.querySelector('button');
                if (btn) { btn.textContent = '✓ SUBSCRIBED!'; setTimeout(() => { btn.textContent = 'SUBSCRIBE'; }, 3000); }
            }
        });
    }

    /* ── Init everything ── */
    function init() {
        injectHeader();
        injectFooter();
        initNav();
        initSearch();
        initTheme();
        initCartBadge();
        initPreloader();
        initNewsletter();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
