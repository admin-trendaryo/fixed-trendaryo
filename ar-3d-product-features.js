/**
 * TRENDARYO - AR/3D PRODUCT FEATURES
 * Augmented reality product viewing, 3D models, virtual try-on, immersive shopping
 */
// 'use client'; - This is a client-side only script for browser execution

class AR3DProductFeatures {
    constructor() {
        this.arSupported = false;
        this.webglSupported = false;
        this.currentProduct = null;
        this.scene3D = null;
        this.camera = null;
        this.renderer = null;
        this.models = new Map();
        this.arSession = null;
        this.viewMode = '3d'; // '3d', 'ar', 'vr'
        this.init();
    }

    init() {
        this.setupAR3DInterface();
        this.checkDeviceCapabilities();
        this.initializeThreeJS();
        this.setupARSupport();
        this.setup3DViewer();
        this.setupVirtualTryOn();
        this.setupProductCustomizer();
        this.setupRoomPlanner();
        this.setup360Viewer();
        this.setupARControls();
        this.setupPerformanceOptimization();
        this.loadProductModels();
    }

    setupAR3DInterface() {
        const ar3dHTML = `
            <div class="ar-3d-container">
                <!-- AR/3D Viewer Header -->
                <div class="ar-3d-header">
                    <div class="viewer-title">
                        <h2>Product Experience</h2>
                        <div class="view-mode-selector">
                            <button class="view-mode-btn active" data-mode="3d">3D View</button>
                            <button class="view-mode-btn" data-mode="ar">AR View</button>
                            <button class="view-mode-btn" data-mode="360">360° View</button>
                            <button class="view-mode-btn" data-mode="tryon">Virtual Try-On</button>
                        </div>
                    </div>
                    <div class="viewer-controls">
                        <button class="fullscreen-btn" id="fullscreen-btn">⛶ Fullscreen</button>
                        <button class="settings-btn" id="ar-settings-btn">⚙️ Settings</button>
                    </div>
                </div>

                <!-- Main Viewer Area -->
                <div class="viewer-main">
                    <!-- 3D Viewer Canvas -->
                    <div class="viewer-canvas-container" id="viewer-canvas-container">
                        <canvas id="ar-3d-canvas" width="800" height="600"></canvas>
                        
                        <!-- Loading Indicator -->
                        <div class="viewer-loading" id="viewer-loading">
                            <div class="loading-spinner"></div>
                            <p>Loading 3D model...</p>
                        </div>
                        
                        <!-- AR Instructions -->
                        <div class="ar-instructions" id="ar-instructions" style="display: none;">
                            <div class="instruction-content">
                                <h3>📱 AR View Instructions</h3>
                                <ol>
                                    <li>Point your camera at a flat surface</li>
                                    <li>Move your device slowly to scan the area</li>
                                    <li>Tap to place the product in your space</li>
                                    <li>Use gestures to rotate and scale</li>
                                </ol>
                                <button class="start-ar-btn" id="start-ar-btn">Start AR Experience</button>
                            </div>
                        </div>
                        
                        <!-- Virtual Try-On Interface -->
                        <div class="tryon-interface" id="tryon-interface" style="display: none;">
                            <div class="tryon-header">
                                <h3>Virtual Try-On</h3>
                                <button class="close-tryon" id="close-tryon">×</button>
                            </div>
                            <div class="tryon-content">
                                <div class="camera-view">
                                    <video id="tryon-video" autoplay muted></video>
                                    <canvas id="tryon-canvas"></canvas>
                                </div>
                                <div class="tryon-controls">
                                    <button class="capture-btn" id="capture-btn">📸 Capture</button>
                                    <button class="switch-camera-btn" id="switch-camera-btn">🔄 Switch Camera</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Product Information Panel -->
                    <div class="product-info-panel">
                        <div class="product-details">
                            <h3 id="ar-product-name">Premium Headphones</h3>
                            <p id="ar-product-description">Experience premium sound quality with our latest wireless headphones featuring active noise cancellation.</p>
                            <div class="product-price">
                                <span class="current-price" id="ar-product-price">$299.99</span>
                                <span class="original-price">$399.99</span>
                            </div>
                        </div>
                        
                        <!-- 3D Controls -->
                        <div class="viewer-controls-panel">
                            <h4>3D Controls</h4>
                            <div class="control-group">
                                <label>Rotation</label>
                                <input type="range" id="rotation-control" min="0" max="360" value="0">
                            </div>
                            <div class="control-group">
                                <label>Zoom</label>
                                <input type="range" id="zoom-control" min="50" max="200" value="100">
                            </div>
                            <div class="control-group">
                                <label>Lighting</label>
                                <input type="range" id="lighting-control" min="0" max="100" value="70">
                            </div>
                            <div class="control-buttons">
                                <button class="control-btn" id="reset-view-btn">🔄 Reset View</button>
                                <button class="control-btn" id="auto-rotate-btn">🔄 Auto Rotate</button>
                            </div>
                        </div>

                        <!-- Color/Variant Selector -->
                        <div class="variant-selector">
                            <h4>Available Colors</h4>
                            <div class="color-options" id="color-options">
                                <button class="color-option active" data-color="black" style="background: #000000"></button>
                                <button class="color-option" data-color="silver" style="background: #C0C0C0"></button>
                                <button class="color-option" data-color="blue" style="background: #0066CC"></button>
                                <button class="color-option" data-color="red" style="background: #CC0000"></button>
                            </div>
                        </div>

                        <!-- Size Selector (for applicable products) -->
                        <div class="size-selector" id="size-selector" style="display: none;">
                            <h4>Size</h4>
                            <div class="size-options" id="size-options">
                                <button class="size-option" data-size="XS">XS</button>
                                <button class="size-option" data-size="S">S</button>
                                <button class="size-option active" data-size="M">M</button>
                                <button class="size-option" data-size="L">L</button>
                                <button class="size-option" data-size="XL">XL</button>
                            </div>
                        </div>

                        <!-- Material Selector -->
                        <div class="material-selector">
                            <h4>Material</h4>
                            <div class="material-options" id="material-options">
                                <button class="material-option active" data-material="leather">Leather</button>
                                <button class="material-option" data-material="fabric">Fabric</button>
                                <button class="material-option" data-material="metal">Metal</button>
                                <button class="material-option" data-material="plastic">Plastic</button>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="viewer-actions">
                            <button class="action-btn primary" id="add-to-cart-3d">🛒 Add to Cart</button>
                            <button class="action-btn secondary" id="save-3d-config">💾 Save Configuration</button>
                            <button class="action-btn secondary" id="share-3d-view">🔗 Share 3D View</button>
                        </div>
                    </div>
                </div>

                <!-- Room Planner -->
                <div class="room-planner" id="room-planner" style="display: none;">
                    <div class="planner-header">
                        <h3>Room Planner</h3>
                        <div class="planner-tools">
                            <button class="tool-btn active" data-tool="select">👆 Select</button>
                            <button class="tool-btn" data-tool="move">✋ Move</button>
                            <button class="tool-btn" data-tool="rotate">🔄 Rotate</button>
                            <button class="tool-btn" data-tool="scale">📏 Scale</button>
                        </div>
                    </div>
                    <div class="planner-canvas">
                        <canvas id="room-canvas" width="600" height="400"></canvas>
                    </div>
                    <div class="planner-sidebar">
                        <h4>Furniture Library</h4>
                        <div class="furniture-items">
                            <div class="furniture-item" data-item="sofa">
                                <div class="item-icon">🛋️</div>
                                <span>Sofa</span>
                            </div>
                            <div class="furniture-item" data-item="table">
                                <div class="item-icon">🪑</div>
                                <span>Table</span>
                            </div>
                            <div class="furniture-item" data-item="lamp">
                                <div class="item-icon">💡</div>
                                <span>Lamp</span>
                            </div>
                            <div class="furniture-item" data-item="plant">
                                <div class="item-icon">🪴</div>
                                <span>Plant</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- AR Settings Modal -->
                <div class="ar-settings-modal" id="ar-settings-modal">
                    <div class="ar-settings-content">
                        <div class="modal-header">
                            <h3>AR/3D Settings</h3>
                            <button class="close-modal" id="close-ar-settings">×</button>
                        </div>
                        <div class="settings-sections">
                            <div class="settings-section">
                                <h4>Graphics Quality</h4>
                                <div class="quality-options">
                                    <label class="quality-option">
                                        <input type="radio" name="quality" value="low">
                                        <span class="radio-dot"></span>
                                        Low (Better Performance)
                                    </label>
                                    <label class="quality-option">
                                        <input type="radio" name="quality" value="medium" checked>
                                        <span class="radio-dot"></span>
                                        Medium (Balanced)
                                    </label>
                                    <label class="quality-option">
                                        <input type="radio" name="quality" value="high">
                                        <span class="radio-dot"></span>
                                        High (Better Quality)
                                    </label>
                                </div>
                            </div>
                            
                            <div class="settings-section">
                                <h4>AR Settings</h4>
                                <div class="setting-options">
                                    <label class="setting-option">
                                        <input type="checkbox" id="enable-sound" checked>
                                        <span class="checkmark"></span>
                                        Enable Sound Effects
                                    </label>
                                    <label class="setting-option">
                                        <input type="checkbox" id="enable-haptics" checked>
                                        <span class="checkmark"></span>
                                        Enable Haptic Feedback
                                    </label>
                                    <label class="setting-option">
                                        <input type="checkbox" id="enable-gestures" checked>
                                        <span class="checkmark"></span>
                                        Enable Hand Gestures
                                    </label>
                                </div>
                            </div>
                            
                            <div class="settings-section">
                                <h4>Performance</h4>
                                <div class="setting-options">
                                    <label class="setting-option">
                                        <input type="checkbox" id="auto-optimize" checked>
                                        <span class="checkmark"></span>
                                        Auto-optimize Performance
                                    </label>
                                    <label class="setting-option">
                                        <input type="checkbox" id="reduce-polygons">
                                        <span class="checkmark"></span>
                                        Reduce Polygon Count
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="settings-actions">
                            <button class="save-settings-btn" id="save-ar-settings">Save Settings</button>
                            <button class="reset-settings-btn" id="reset-ar-settings">Reset to Default</button>
                        </div>
                    </div>
                </div>

                <!-- Share Modal -->
                <div class="share-modal" id="share-modal">
                    <div class="share-content">
                        <div class="modal-header">
                            <h3>Share 3D View</h3>
                            <button class="close-modal" id="close-share-modal">×</button>
                        </div>
                        <div class="share-options">
                            <div class="share-link">
                                <label>Share Link</label>
                                <div class="link-input-group">
                                    <input type="text" id="share-link" readonly value="https://trendaryo.com/3d/product-123">
                                    <button class="copy-link-btn" id="copy-share-link">📋 Copy</button>
                                </div>
                            </div>
                            <div class="share-buttons">
                                <button class="share-btn" data-platform="facebook">📘 Facebook</button>
                                <button class="share-btn" data-platform="twitter">🐦 Twitter</button>
                                <button class="share-btn" data-platform="instagram">📷 Instagram</button>
                                <button class="share-btn" data-platform="whatsapp">💬 WhatsApp</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Performance Monitor -->
                <div class="performance-monitor" id="performance-monitor">
                    <div class="monitor-stats">
                        <div class="stat-item">
                            <span class="stat-label">FPS:</span>
                            <span class="stat-value" id="fps-counter">60</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Memory:</span>
                            <span class="stat-value" id="memory-usage">45MB</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Draw Calls:</span>
                            <span class="stat-value" id="draw-calls">124</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insert AR/3D interface
        const ar3dSection = document.querySelector('.product-3d-section') || 
                             document.querySelector('.product-detail-section') ||
                             document.querySelector('main');
        
        if (ar3dSection) {
            ar3dSection.innerHTML = ar3dHTML;
        }

        this.setupAR3DEventListeners();
    }

    setupAR3DEventListeners() {
        // View mode buttons
        document.querySelectorAll('.view-mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.changeViewMode(btn.dataset.mode);
                document.querySelectorAll('.view-mode-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Fullscreen button
        document.getElementById('fullscreen-btn')?.addEventListener('click', () => {
            this.toggleFullscreen();
        });

        // AR settings button
        document.getElementById('ar-settings-btn')?.addEventListener('click', () => {
            this.showARSettings();
        });

        // 3D controls
        document.getElementById('rotation-control')?.addEventListener('input', (e) => {
            this.updateRotation(e.target.value);
        });

        document.getElementById('zoom-control')?.addEventListener('input', (e) => {
            this.updateZoom(e.target.value);
        });

        document.getElementById('lighting-control')?.addEventListener('input', (e) => {
            this.updateLighting(e.target.value);
        });

        // Control buttons
        document.getElementById('reset-view-btn')?.addEventListener('click', () => {
            this.resetView();
        });

        document.getElementById('auto-rotate-btn')?.addEventListener('click', () => {
            this.toggleAutoRotate();
        });

        // Color options
        document.querySelectorAll('.color-option').forEach(btn => {
            btn.addEventListener('click', () => {
                this.changeProductColor(btn.dataset.color);
                document.querySelectorAll('.color-option').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Size options
        document.querySelectorAll('.size-option').forEach(btn => {
            btn.addEventListener('click', () => {
                this.changeProductSize(btn.dataset.size);
                document.querySelectorAll('.size-option').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Material options
        document.querySelectorAll('.material-option').forEach(btn => {
            btn.addEventListener('click', () => {
                this.changeProductMaterial(btn.dataset.material);
                document.querySelectorAll('.material-option').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Action buttons
        document.getElementById('add-to-cart-3d')?.addEventListener('click', () => {
            this.addToCartFrom3D();
        });

        document.getElementById('save-3d-config')?.addEventListener('click', () => {
            this.saveConfiguration();
        });

        document.getElementById('share-3d-view')?.addEventListener('click', () => {
            this.showShareModal();
        });

        // AR specific
        document.getElementById('start-ar-btn')?.addEventListener('click', () => {
            this.startARSession();
        });

        // Virtual try-on
        document.getElementById('close-tryon')?.addEventListener('click', () => {
            this.closeVirtualTryOn();
        });

        document.getElementById('capture-btn')?.addEventListener('click', () => {
            this.captureTryOnPhoto();
        });

        document.getElementById('switch-camera-btn')?.addEventListener('click', () => {
            this.switchCamera();
        });

        // Room planner
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectPlannerTool(btn.dataset.tool);
                document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        document.querySelectorAll('.furniture-item').forEach(item => {
            item.addEventListener('click', () => {
                this.addFurnitureToRoom(item.dataset.item);
            });
        });

        // Modals
        document.getElementById('close-ar-settings')?.addEventListener('click', () => {
            this.hideARSettings();
        });

        document.getElementById('save-ar-settings')?.addEventListener('click', () => {
            this.saveARSettings();
        });

        document.getElementById('reset-ar-settings')?.addEventListener('click', () => {
            this.resetARSettings();
        });

        document.getElementById('close-share-modal')?.addEventListener('click', () => {
            this.hideShareModal();
        });

        document.getElementById('copy-share-link')?.addEventListener('click', () => {
            this.copyShareLink();
        });

        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.share3DView(btn.dataset.platform);
            });
        });

        // Close modals on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('ar-settings-modal') ||
                e.target.classList.contains('share-modal')) {
                e.target.style.display = 'none';
            }
        });
    }

    async checkDeviceCapabilities() {
        // Detect mobile device
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        
        // Check for AR support
        this.arSupported = 'xr' in navigator && await navigator.xr?.isSessionSupported('immersive-ar');
        
        // Check for WebGL support with mobile fallbacks
        const canvas = document.createElement('canvas');
        let gl = null;
        
        // Try WebGL2 first (better performance)
        gl = canvas.getContext('webgl2') || canvas.getContext('experimental-webgl2');
        
        // Fallback to WebGL1
        if (!gl) {
            gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        }
        
        this.webglSupported = !!gl;
        
        // Check for WebGL extensions on mobile
        if (this.webglSupported && gl) {
            // Check for essential extensions
            const extensions = {
                OES_element_index_uint: gl.getExtension('OES_element_index_uint'),
                OES_standard_derivatives: gl.getExtension('OES_standard_derivatives'),
                OES_vertex_array_object: gl.getExtension('OES_vertex_array_object'),
                WEBGL_depth_texture: gl.getExtension('WEBGL_depth_texture')
            };
            
            // Some mobile devices might not support all extensions
            this.webglExtensionsSupported = Object.values(extensions).some(ext => ext !== null);
        }
        
        // Check for camera access
        this.cameraSupported = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
        
        // Check for touch support
        this.touchSupported = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Check device memory and performance
        if ('deviceMemory' in navigator) {
            this.deviceMemory = navigator.deviceMemory;
            this.lowMemoryDevice = this.deviceMemory < 4; // Less than 4GB is considered low memory
        }
        
        // Update UI based on capabilities
        this.updateCapabilityUI();
    }

    updateCapabilityUI() {
        // Show/hide AR button based on support
        const arButton = document.querySelector('[data-mode="ar"]');
        if (arButton) {
            arButton.style.display = this.arSupported ? 'block' : 'none';
        }
        
        // Show/hide virtual try-on based on camera support
        const tryOnButton = document.querySelector('[data-mode="tryon"]');
        if (tryOnButton) {
            tryOnButton.style.display = this.cameraSupported ? 'block' : 'none';
        }
        
        // Show warning if 3D not supported
        if (!this.webglSupported) {
            this.showWebGLError();
        }
    }

    showWebGLError() {
        const canvas = document.getElementById('ar-3d-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('WebGL is not supported on your device', canvas.width / 2, canvas.height / 2);
            ctx.fillText('Please try a different browser or device', canvas.width / 2, canvas.height / 2 + 30);
        }
    }

    initializeThreeJS() {
        if (!this.webglSupported) {
            this.showWebGLError();
            return;
        }
        
        try {
            // Initialize Three.js scene with mobile optimizations
            this.scene3D = new THREE.Scene();
            
            // Mobile-optimized background
            if (this.isMobile) {
                this.scene3D.background = new THREE.Color(0x1a1a2a); // Darker background for mobile
            } else {
                this.scene3D.background = new THREE.Color(0xf0f0f0);
            }
            
            // Setup camera with mobile considerations
            const canvas = document.getElementById('ar-3d-canvas');
            if (!canvas) {
                console.error('Canvas not found');
                return;
            }
            
            // Mobile-optimized camera settings
            const fov = this.isMobile ? 60 : 75; // Wider FOV for mobile
            const aspect = canvas.width / canvas.height;
            const near = this.isMobile ? 0.5 : 0.1; // Adjust near plane for mobile
            const far = this.lowMemoryDevice ? 500 : 1000; // Reduce far plane for low memory devices
            
            this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
            this.camera.position.z = 5;
            
            // Setup renderer with mobile optimizations
            const rendererOptions = {
                canvas: canvas,
                antialias: !this.lowMemoryDevice, // Disable antialiasing on low memory devices
                alpha: true,
                powerPreference: this.isMobile ? 'low-power' : 'high-performance',
                failIfMajorPerformanceCaveat: false
            };
            
            // Try to create renderer with WebGL2 if available
            try {
                this.renderer = new THREE.WebGLRenderer(rendererOptions);
            } catch (error) {
                console.warn('WebGL renderer failed, trying fallback:', error);
                // Fallback to basic renderer
                this.renderer = new THREE.WebGLRenderer({
                    canvas: canvas,
                    antialias: false,
                    alpha: false
                });
            }
            
            // Mobile-optimized renderer settings
            this.renderer.setSize(canvas.width, canvas.height);
            
            // Reduce pixel ratio on mobile for better performance
            if (this.isMobile || this.lowMemoryDevice) {
                this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            } else {
                this.renderer.setPixelRatio(window.devicePixelRatio);
            }
            
            // Disable or reduce shadow quality on mobile
            if (this.isMobile || this.lowMemoryDevice) {
                this.renderer.shadowMap.enabled = false;
            } else {
                this.renderer.shadowMap.enabled = true;
                this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            }
            
            // Add lights with mobile optimizations
            this.setupLighting();
            
            // Add controls
            this.setupOrbitControls();
            
            // Start render loop with mobile optimizations
            this.startRenderLoop();
            
        } catch (error) {
            console.error('Three.js initialization failed:', error);
            this.showWebGLError();
        }
    }

    setupLighting() {
        // Mobile-optimized lighting setup
        let ambientIntensity = this.isMobile ? 0.8 : 0.6;
        let directionalIntensity = this.isMobile ? 0.6 : 0.8;
        
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, ambientIntensity);
        this.scene3D.add(ambientLight);
        
        // Directional light with mobile optimizations
        const directionalLight = new THREE.DirectionalLight(0xffffff, directionalIntensity);
        directionalLight.position.set(10, 10, 5);
        
        // Reduce shadow quality on mobile
        if (!this.isMobile && !this.lowMemoryDevice) {
            directionalLight.castShadow = true;
            directionalLight.shadow.mapSize.width = 2048;
            directionalLight.shadow.mapSize.height = 2048;
        } else {
            directionalLight.castShadow = false;
        }
        
        this.scene3D.add(directionalLight);
        
        // Add point light only on desktop/higher-end devices
        if (!this.lowMemoryDevice) {
            const pointLight = new THREE.PointLight(0xffffff, this.isMobile ? 0.3 : 0.5);
            pointLight.position.set(-10, 10, -5);
            this.scene3D.add(pointLight);
            this.lights = { ambientLight, directionalLight, pointLight };
        } else {
            this.lights = { ambientLight, directionalLight };
        }
    }

    setupOrbitControls() {
        // Mobile-optimized orbit controls
        this.controls = {
            enabled: true,
            autoRotate: false,
            rotationSpeed: this.isMobile ? 0.008 : 0.005, // Faster rotation on mobile
            zoomSpeed: this.isMobile ? 0.15 : 0.1, // Faster zoom on mobile
            minDistance: 2,
            maxDistance: 10,
            
            mouseDown: false,
            mouseX: 0,
            mouseY: 0,
            targetRotationX: 0,
            targetRotationY: 0,
            targetDistance: 5,
            
            // Touch-specific properties
            touchStartDistance: 0,
            lastTouchTime: 0
        };
        
        const canvas = document.getElementById('ar-3d-canvas');
        if (!canvas) return;
        
        // Mouse events (desktop)
        if (!this.isMobile) {
            canvas.addEventListener('mousedown', (e) => {
                this.controls.mouseDown = true;
                this.controls.mouseX = e.clientX;
                this.controls.mouseY = e.clientY;
            });
            
            canvas.addEventListener('mousemove', (e) => {
                if (!this.controls.mouseDown) return;
                
                const deltaX = e.clientX - this.controls.mouseX;
                const deltaY = e.clientY - this.controls.mouseY;
                
                this.controls.targetRotationY += deltaX * this.controls.rotationSpeed;
                this.controls.targetRotationX += deltaY * this.controls.rotationSpeed;
                
                this.controls.mouseX = e.clientX;
                this.controls.mouseY = e.clientY;
            });
            
            canvas.addEventListener('mouseup', () => {
                this.controls.mouseDown = false;
            });
            
            canvas.addEventListener('wheel', (e) => {
                e.preventDefault();
                const delta = e.deltaY > 0 ? 1 : -1;
                this.controls.targetDistance = Math.max(
                    this.controls.minDistance,
                    Math.min(this.controls.maxDistance, this.controls.targetDistance + delta * this.controls.zoomSpeed)
                );
            });
        }
        
        // Touch events (mobile)
        if (this.touchSupported) {
            canvas.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const now = Date.now();
                
                if (e.touches.length === 1) {
                    // Single touch - rotation
                    this.controls.mouseDown = true;
                    this.controls.mouseX = e.touches[0].clientX;
                    this.controls.mouseY = e.touches[0].clientY;
                    
                    // Double tap detection
                    if (now - this.controls.lastTouchTime < 300) {
                        this.resetView();
                    }
                    this.controls.lastTouchTime = now;
                    
                } else if (e.touches.length === 2) {
                    // Two finger touch - zoom
                    this.controls.mouseDown = false;
                    const dx = e.touches[0].clientX - e.touches[1].clientX;
                    const dy = e.touches[0].clientY - e.touches[1].clientY;
                    this.controls.touchStartDistance = Math.sqrt(dx * dx + dy * dy);
                }
            });
            
            canvas.addEventListener('touchmove', (e) => {
                e.preventDefault();
                
                if (e.touches.length === 1 && this.controls.mouseDown) {
                    // Single finger rotation
                    const deltaX = e.touches[0].clientX - this.controls.mouseX;
                    const deltaY = e.touches[0].clientY - this.controls.mouseY;
                    
                    this.controls.targetRotationY += deltaX * this.controls.rotationSpeed;
                    this.controls.targetRotationX += deltaY * this.controls.rotationSpeed;
                    
                    this.controls.mouseX = e.touches[0].clientX;
                    this.controls.mouseY = e.touches[0].clientY;
                    
                } else if (e.touches.length === 2) {
                    // Two finger zoom
                    const dx = e.touches[0].clientX - e.touches[1].clientX;
                    const dy = e.touches[0].clientY - e.touches[1].clientY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (this.controls.touchStartDistance > 0) {
                        const scale = distance / this.controls.touchStartDistance;
                        this.controls.targetDistance = Math.max(
                            this.controls.minDistance,
                            Math.min(this.controls.maxDistance, this.controls.targetDistance / scale)
                        );
                    }
                    
                    this.controls.touchStartDistance = distance;
                }
            });
            
            canvas.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.controls.mouseDown = false;
                this.controls.touchStartDistance = 0;
            });
        }
    }

    setupARSupport() {
        // Initialize WebXR support
        if (this.arSupported) {
            this.setupWebXR();
        }
    }

    async setupWebXR() {
        try {
            // Request XR session
            this.xrSession = await navigator.xr.requestSession('immersive-ar', {
                requiredFeatures: ['local', 'hit-test'],
                optionalFeatures: ['dom-overlay', 'light-estimation']
            });
            
            // Setup XR rendering
            this.setupXRRendering();
            
        } catch (error) {
            console.error('AR setup failed:', error);
            this.showARError();
        }
    }

    setupXRRendering() {
        // Setup XR render loop
        this.xrSession.requestAnimationFrame(this.onXRFrame.bind(this));
    }

    onXRFrame(time, frame) {
        if (!this.xrSession) return;
        
        // XR frame rendering logic
        this.xrSession.requestAnimationFrame(this.onXRFrame.bind(this));
    }

    setup3DViewer() {
        // Setup 3D product viewer
        this.loadProductModel('headphones');
    }

    setupVirtualTryOn() {
        // Setup virtual try-on functionality
        this.initializeCamera();
    }

    setupProductCustomizer() {
        // Setup product customization options
        this.customizationOptions = {
            colors: ['black', 'silver', 'blue', 'red'],
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            materials: ['leather', 'fabric', 'metal', 'plastic']
        };
    }

    setupRoomPlanner() {
        // Setup room planner functionality
        this.roomPlanner = {
            furniture: [],
            selectedTool: 'select',
            gridSize: 50
        };
    }

    setup360Viewer() {
        // Setup 360-degree product viewer
        this.setup360Images();
    }

    setupARControls() {
        // Setup AR-specific controls
        this.arControls = {
            placement: true,
            scaling: true,
            rotation: true,
            gestures: true
        };
    }

    setupPerformanceOptimization() {
        // Setup performance monitoring and optimization
        this.performanceMonitor = {
            fps: 60,
            memoryUsage: 0,
            drawCalls: 0,
            targetFPS: 60
        };
        
        this.startPerformanceMonitoring();
    }

    async loadProductModels() {
        // Load 3D product models
        const products = [
            { id: 'headphones', name: 'Premium Headphones', model: 'headphones.glb' },
            { id: 'watch', name: 'Smart Watch', model: 'watch.glb' },
            { id: 'shoes', name: 'Running Shoes', model: 'shoes.glb' },
            { id: 'bag', name: 'Designer Bag', model: 'bag.glb' }
        ];
        
        for (const product of products) {
            await this.loadProductModel(product.id);
        }
    }

    async loadProductModel(productId) {
        try {
            // Show loading indicator
            this.showLoading();
            
            // Create simple geometry for demonstration
            let geometry, material, mesh;
            
            switch (productId) {
                case 'headphones':
                    // Create headphones geometry
                    geometry = new THREE.BoxGeometry(2, 1, 2);
                    material = new THREE.MeshPhongMaterial({ color: 0x333333 });
                    mesh = new THREE.Mesh(geometry, material);
                    mesh.castShadow = true;
                    mesh.receiveShadow = true;
                    break;
                    
                case 'watch':
                    // Create watch geometry
                    geometry = new THREE.CylinderGeometry(1, 1, 0.3, 32);
                    material = new THREE.MeshPhongMaterial({ color: 0x444444 });
                    mesh = new THREE.Mesh(geometry, material);
                    mesh.castShadow = true;
                    mesh.receiveShadow = true;
                    break;
                    
                default:
                    // Default box
                    geometry = new THREE.BoxGeometry(1, 1, 1);
                    material = new THREE.MeshPhongMaterial({ color: 0x666666 });
                    mesh = new THREE.Mesh(geometry, material);
                    mesh.castShadow = true;
                    mesh.receiveShadow = true;
            }
            
            // Add to scene
            if (this.currentProduct) {
                this.scene3D.remove(this.currentProduct);
            }
            
            this.currentProduct = mesh;
            this.scene3D.add(this.currentProduct);
            
            // Store model
            this.models.set(productId, mesh);
            
            this.hideLoading();
            
        } catch (error) {
            console.error('Failed to load 3D model:', error);
            this.hideLoading();
            this.showModelError();
        }
    }

    setup360Images() {
        // Setup 360-degree image viewer
        this.images360 = [
            'product-360-1.jpg', 'product-360-2.jpg', 'product-360-3.jpg',
            'product-360-4.jpg', 'product-360-5.jpg', 'product-360-6.jpg',
            'product-360-7.jpg', 'product-360-8.jpg'
        ];
    }

    changeViewMode(mode) {
        this.viewMode = mode;
        
        // Hide all view panels
        document.getElementById('ar-instructions').style.display = 'none';
        document.getElementById('tryon-interface').style.display = 'none';
        document.getElementById('room-planner').style.display = 'none';
        
        // Show appropriate view
        switch (mode) {
            case '3d':
                this.show3DView();
                break;
            case 'ar':
                this.showARView();
                break;
            case '360':
                this.show360View();
                break;
            case 'tryon':
                this.showVirtualTryOn();
                break;
        }
    }

    show3DView() {
        // Show 3D viewer
        const canvas = document.getElementById('ar-3d-canvas');
        canvas.style.display = 'block';
        
        // Resume render loop
        this.rendering = true;
    }

    showARView() {
        if (!this.arSupported) {
            alert('AR is not supported on your device');
            return;
        }
        
        // Show AR instructions
        document.getElementById('ar-instructions').style.display = 'block';
        const canvas = document.getElementById('ar-3d-canvas');
        canvas.style.display = 'none';
    }

    show360View() {
        // Show 360 viewer
        this.setup360Viewer();
    }

    showVirtualTryOn() {
        if (!this.cameraSupported) {
            alert('Camera is not available on your device');
            return;
        }
        
        // Show virtual try-on interface
        document.getElementById('tryon-interface').style.display = 'block';
        const canvas = document.getElementById('ar-3d-canvas');
        canvas.style.display = 'none';
        
        this.startVirtualTryOn();
    }

    async startARSession() {
        try {
            // Start AR session
            if (!this.xrSession) {
                this.xrSession = await navigator.xr.requestSession('immersive-ar');
            }
            
            // Hide instructions
            document.getElementById('ar-instructions').style.display = 'none';
            
            // Start AR rendering
            this.startARRendering();
            
        } catch (error) {
            console.error('Failed to start AR session:', error);
            this.showARError();
        }
    }

    startARRendering() {
        // Start AR rendering loop
        const canvas = document.getElementById('ar-3d-canvas');
        canvas.style.display = 'block';
        
        // Initialize XR rendering context
        this.xrSession.updateRenderState({
            baseLayer: new XRWebGLLayer(this.xrSession, this.renderer.getContext())
        });
        
        // Start XR frame loop
        this.xrSession.requestAnimationFrame(this.onXRFrame.bind(this));
    }

    async initializeCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'user' },
                audio: false 
            });
            
            const video = document.getElementById('tryon-video');
            video.srcObject = stream;
            
            this.cameraStream = stream;
            
        } catch (error) {
            console.error('Failed to initialize camera:', error);
        }
    }

    startVirtualTryOn() {
        // Start virtual try-on processing
        const video = document.getElementById('tryon-video');
        const canvas = document.getElementById('tryon-canvas');
        const ctx = canvas.getContext('2d');
        
        // Process video frames for virtual try-on
        const processFrame = () => {
            if (this.viewMode !== 'tryon') return;
            
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            // Draw video frame
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Apply virtual try-on effects
            this.applyVirtualTryOnEffects(ctx, canvas.width, canvas.height);
            
            requestAnimationFrame(processFrame);
        };
        
        processFrame();
    }

    applyVirtualTryOnEffects(ctx, width, height) {
        // Apply virtual try-on effects (simplified)
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 2;
        
        // Draw face detection overlay (simplified)
        ctx.strokeRect(width * 0.3, height * 0.2, width * 0.4, height * 0.4);
        
        // Draw product overlay
        ctx.fillStyle = 'rgba(0, 240, 255, 0.3)';
        ctx.fillRect(width * 0.35, height * 0.1, width * 0.3, height * 0.2);
    }

    captureTryOnPhoto() {
        const canvas = document.getElementById('tryon-canvas');
        
        // Convert canvas to blob and download
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'virtual-tryon.jpg';
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    async switchCamera() {
        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => track.stop());
        }
        
        const facingMode = this.currentCamera === 'user' ? 'environment' : 'user';
        this.currentCamera = facingMode;
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: facingMode },
                audio: false 
            });
            
            const video = document.getElementById('tryon-video');
            video.srcObject = stream;
            this.cameraStream = stream;
            
        } catch (error) {
            console.error('Failed to switch camera:', error);
        }
    }

    closeVirtualTryOn() {
        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => track.stop());
            this.cameraStream = null;
        }
        
        document.getElementById('tryon-interface').style.display = 'none';
        this.changeViewMode('3d');
    }

    updateRotation(value) {
        if (!this.currentProduct) return;
        
        const radians = (value * Math.PI) / 180;
        this.currentProduct.rotation.y = radians;
    }

    updateZoom(value) {
        if (!this.camera) return;
        
        const distance = 10 - (value / 100) * 8; // Map 50-200 to 2-10
        this.camera.position.z = distance;
    }

    updateLighting(value) {
        if (!this.lights) return;
        
        const intensity = value / 100;
        this.lights.directionalLight.intensity = intensity * 0.8;
        this.lights.pointLight.intensity = intensity * 0.5;
    }

    resetView() {
        if (!this.currentProduct || !this.camera) return;
        
        // Reset product rotation
        this.currentProduct.rotation.set(0, 0, 0);
        
        // Reset camera position
        this.camera.position.set(0, 0, 5);
        this.camera.lookAt(0, 0, 0);
        
        // Reset controls
        this.controls.targetRotationX = 0;
        this.controls.targetRotationY = 0;
        this.controls.targetDistance = 5;
        
        // Reset UI controls
        document.getElementById('rotation-control').value = 0;
        document.getElementById('zoom-control').value = 100;
        document.getElementById('lighting-control').value = 70;
    }

    toggleAutoRotate() {
        this.controls.autoRotate = !this.controls.autoRotate;
        
        const btn = document.getElementById('auto-rotate-btn');
        btn.textContent = this.controls.autoRotate ? '⏸ Stop Rotation' : '🔄 Auto Rotate';
    }

    changeProductColor(color) {
        if (!this.currentProduct) return;
        
        const colorMap = {
            black: 0x000000,
            silver: 0xC0C0C0,
            blue: 0x0066CC,
            red: 0xCC0000
        };
        
        const material = this.currentProduct.material;
        if (material) {
            material.color.setHex(colorMap[color] || 0x666666);
        }
    }

    changeProductSize(size) {
        if (!this.currentProduct) return;
        
        const sizeMap = {
            'XS': 0.8,
            'S': 0.9,
            'M': 1.0,
            'L': 1.1,
            'XL': 1.2
        };
        
        const scale = sizeMap[size] || 1.0;
        this.currentProduct.scale.set(scale, scale, scale);
    }

    changeProductMaterial(material) {
        if (!this.currentProduct) return;
        
        const materialMap = {
            leather: { roughness: 0.8, metalness: 0.1 },
            fabric: { roughness: 0.9, metalness: 0.0 },
            metal: { roughness: 0.2, metalness: 0.8 },
            plastic: { roughness: 0.5, metalness: 0.0 }
        };
        
        const props = materialMap[material] || { roughness: 0.5, metalness: 0.0 };
        
        const material = this.currentProduct.material;
        if (material) {
            material.roughness = props.roughness;
            material.metalness = props.metalness;
        }
    }

    addToCartFrom3D() {
        // Get current configuration
        const config = {
            color: document.querySelector('.color-option.active')?.dataset.color || 'black',
            size: document.querySelector('.size-option.active')?.dataset.size || 'M',
            material: document.querySelector('.material-option.active')?.dataset.material || 'leather'
        };
        
        // Add to cart with configuration
        if (window.pwaManager) {
            window.pwaManager.showStatusMessage('Added to cart with custom configuration', 'success');
        }
        
        // Track analytics
        this.track3DInteraction('add_to_cart', config);
    }

    saveConfiguration() {
        const config = {
            color: document.querySelector('.color-option.active')?.dataset.color || 'black',
            size: document.querySelector('.size-option.active')?.dataset.size || 'M',
            material: document.querySelector('.material-option.active')?.dataset.material || 'leather',
            timestamp: Date.now()
        };
        
        // Save to localStorage
        localStorage.setItem('trendaryo_3d_config', JSON.stringify(config));
        
        if (window.pwaManager) {
            window.pwaManager.showStatusMessage('Configuration saved', 'success');
        }
    }

    showShareModal() {
        document.getElementById('share-modal').style.display = 'flex';
    }

    hideShareModal() {
        document.getElementById('share-modal').style.display = 'none';
    }

    copyShareLink() {
        const input = document.getElementById('share-link');
        input.select();
        document.execCommand('copy');
        
        const btn = document.getElementById('copy-share-link');
        const originalText = btn.textContent;
        btn.textContent = '✓ Copied!';
        
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    }

    share3DView(platform) {
        const url = document.getElementById('share-link').value;
        const text = 'Check out this 3D product view!';
        
        let shareUrl = '';
        
        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
                break;
            case 'instagram':
                // Instagram doesn't support direct URL sharing
                alert('Share this link on Instagram: ' + url);
                return;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
                break;
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
            this.track3DInteraction('share', { platform });
        }
    }

    selectPlannerTool(tool) {
        this.roomPlanner.selectedTool = tool;
    }

    addFurnitureToRoom(itemType) {
        // Add furniture item to room planner
        const item = {
            type: itemType,
            position: { x: 0, y: 0 },
            rotation: 0,
            scale: 1
        };
        
        this.roomPlanner.furniture.push(item);
        this.updateRoomPlanner();
    }

    updateRoomPlanner() {
        // Update room planner canvas
        const canvas = document.getElementById('room-canvas');
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        this.drawGrid(ctx, canvas.width, canvas.height);
        
        // Draw furniture
        this.roomPlanner.furniture.forEach(item => {
            this.drawFurniture(ctx, item);
        });
    }

    drawGrid(ctx, width, height) {
        const gridSize = this.roomPlanner.gridSize;
        
        ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
        ctx.lineWidth = 1;
        
        for (let x = 0; x <= width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        
        for (let y = 0; y <= height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
    }

    drawFurniture(ctx, item) {
        const x = item.position.x;
        const y = item.position.y;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(item.rotation * Math.PI / 180);
        ctx.scale(item.scale, item.scale);
        
        // Draw furniture based on type
        switch (item.type) {
            case 'sofa':
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(-40, -20, 80, 40);
                break;
            case 'table':
                ctx.fillStyle = '#654321';
                ctx.fillRect(-30, -30, 60, 60);
                break;
            case 'lamp':
                ctx.fillStyle = '#FFD700';
                ctx.beginPath();
                ctx.arc(0, 0, 15, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'plant':
                ctx.fillStyle = '#228B22';
                ctx.beginPath();
                ctx.arc(0, 0, 20, 0, Math.PI * 2);
                ctx.fill();
                break;
        }
        
        ctx.restore();
    }

    startRenderLoop() {
        this.rendering = true;
        this.lastTime = performance.now();
        this.frameCount = 0;
        this.targetFPS = this.isMobile ? 30 : 60; // Lower FPS on mobile
        this.frameInterval = 1000 / this.targetFPS;
        this.then = performance.now();
        
        const render = (currentTime) => {
            if (!this.rendering) return;
            
            requestAnimationFrame(render);
            
            // Frame rate limiting for mobile
            if (this.isMobile) {
                const now = performance.now();
                const elapsed = now - this.then;
                
                if (elapsed > this.frameInterval) {
                    this.then = now - (elapsed % this.frameInterval);
                } else {
                    return; // Skip this frame
                }
            }
            
            // Calculate delta time
            const deltaTime = currentTime - this.lastTime;
            this.lastTime = currentTime;
            
            // Update performance monitor (less frequently on mobile)
            this.frameCount++;
            if (!this.isMobile || this.frameCount % 10 === 0) {
                this.updatePerformanceMonitor(deltaTime);
            }
            
            // Update controls
            this.updateControls();
            
            // Auto rotate (slower on mobile)
            if (this.controls.autoRotate && this.currentProduct) {
                const rotationSpeed = this.isMobile ? 0.005 : 0.01;
                this.currentProduct.rotation.y += rotationSpeed;
            }
            
            // Render scene with error handling
            try {
                if (this.renderer && this.scene3D && this.camera) {
                    this.renderer.render(this.scene3D, this.camera);
                }
            } catch (error) {
                console.error('Render error:', error);
                // Try to recover by reducing quality
                if (this.isMobile) {
                    this.reduceRenderQuality();
                }
            }
        };
        
        render(performance.now());
    }
    
    reduceRenderQuality() {
        // Emergency quality reduction for performance issues
        if (this.renderer) {
            this.renderer.setPixelRatio(1);
            this.renderer.shadowMap.enabled = false;
            
            // Reduce lighting
            if (this.lights) {
                if (this.lights.ambientLight) {
                    this.lights.ambientLight.intensity = 0.9;
                }
                if (this.lights.directionalLight) {
                    this.lights.directionalLight.intensity = 0.5;
                }
                if (this.lights.pointLight) {
                    this.lights.pointLight.intensity = 0.2;
                }
            }
        }
    }

    updateControls() {
        if (!this.currentProduct) return;
        
        // Smooth rotation (faster on mobile for better responsiveness)
        const smoothFactor = this.isMobile ? 0.2 : 0.1;
        
        if (this.currentProduct) {
            this.currentProduct.rotation.y += (this.controls.targetRotationY - this.currentProduct.rotation.y) * smoothFactor;
            this.currentProduct.rotation.x += (this.controls.targetRotationX - this.currentProduct.rotation.x) * smoothFactor;
        }
        
        // Smooth zoom
        this.camera.position.z += (this.controls.targetDistance - this.camera.position.z) * smoothFactor;
    }
    
    resetView() {
        // Reset to default view
        this.controls.targetRotationX = 0;
        this.controls.targetRotationY = 0;
        this.controls.targetDistance = 5;
        
        // Animate reset
        if (this.currentProduct) {
            this.currentProduct.rotation.x = 0;
            this.currentProduct.rotation.y = 0;
        }
        this.camera.position.z = 5;
    }

    startPerformanceMonitoring() {
        this.frameCount = 0;
        this.fpsUpdateTime = 0;
        
        setInterval(() => {
            this.updatePerformanceDisplay();
        }, 1000);
    }

    updatePerformanceMonitor(deltaTime) {
        // Calculate FPS
        this.frameCount++;
        this.fpsUpdateTime += deltaTime;
        
        if (this.fpsUpdateTime >= 1000) {
            this.performanceMonitor.fps = Math.round(this.frameCount * 1000 / this.fpsUpdateTime);
            this.frameCount = 0;
            this.fpsUpdateTime = 0;
        }
        
        // Estimate memory usage (simplified)
        if (performance.memory) {
            this.performanceMonitor.memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
        }
        
        // Count draw calls (simplified)
        this.performanceMonitor.drawCalls = this.scene3D ? this.scene3D.children.length : 0;
    }

    updatePerformanceDisplay() {
        document.getElementById('fps-counter').textContent = this.performanceMonitor.fps;
        document.getElementById('memory-usage').textContent = this.performanceMonitor.memoryUsage + 'MB';
        document.getElementById('draw-calls').textContent = this.performanceMonitor.drawCalls;
    }

    toggleFullscreen() {
        const container = document.getElementById('viewer-canvas-container');
        
        if (!document.fullscreenElement) {
            container.requestFullscreen().catch(err => {
                console.error('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    showARSettings() {
        document.getElementById('ar-settings-modal').style.display = 'flex';
    }

    hideARSettings() {
        document.getElementById('ar-settings-modal').style.display = 'none';
    }

    saveARSettings() {
        const quality = document.querySelector('input[name="quality"]:checked')?.value || 'medium';
        const enableSound = document.getElementById('enable-sound')?.checked || false;
        const enableHaptics = document.getElementById('enable-haptics')?.checked || false;
        const enableGestures = document.getElementById('enable-gestures')?.checked || false;
        
        // Save settings
        localStorage.setItem('trendaryo_ar_settings', JSON.stringify({
            quality, enableSound, enableHaptics, enableGestures
        }));
        
        this.applyARSettings({ quality, enableSound, enableHaptics, enableGestures });
        this.hideARSettings();
        
        if (window.pwaManager) {
            window.pwaManager.showStatusMessage('AR settings saved', 'success');
        }
    }

    resetARSettings() {
        // Reset to default settings
        document.querySelector('input[name="quality"][value="medium"]').checked = true;
        document.getElementById('enable-sound').checked = true;
        document.getElementById('enable-haptics').checked = true;
        document.getElementById('enable-gestures').checked = true;
        
        this.hideARSettings();
        
        if (window.pwaManager) {
            window.pwaManager.showStatusMessage('Settings reset to default', 'info');
        }
    }

    applyARSettings(settings) {
        // Apply AR settings
        if (settings.quality === 'low') {
            this.renderer.setPixelRatio(1);
        } else if (settings.quality === 'high') {
            this.renderer.setPixelRatio(window.devicePixelRatio);
        }
        
        this.arControls.gestures = settings.enableGestures;
    }

    showLoading() {
        document.getElementById('viewer-loading').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('viewer-loading').style.display = 'none';
    }

    showModelError() {
        const canvas = document.getElementById('ar-3d-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Failed to load 3D model', canvas.width / 2, canvas.height / 2);
        }
    }

    showARError() {
        alert('AR is not available on your device. Please try using a supported device or browser.');
    }

    track3DInteraction(action, data = {}) {
        // Track 3D/AR interactions
        if (window.gtag) {
            gtag('event', action, {
                event_category: '3d_ar',
                event_label: this.viewMode,
                custom_parameter_1: JSON.stringify(data)
            });
        }
    }
}

// Add CSS for AR/3D features
const ar3dFeaturesCSS = `
<style>
.ar-3d-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.ar-3d-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.viewer-title h2 {
    color: white;
    margin-bottom: 1rem;
}

.view-mode-selector {
    display: flex;
    gap: 0.5rem;
}

.view-mode-btn {
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;
    transition: all 0.3s ease;
}

.view-mode-btn.active,
.view-mode-btn:hover {
    background: rgba(0, 240, 255, 0.2);
    color: #00f0ff;
    border-color: rgba(0, 240, 255, 0.3);
}

.viewer-controls {
    display: flex;
    gap: 1rem;
}

.fullscreen-btn,
.settings-btn {
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
}

.fullscreen-btn:hover,
.settings-btn:hover {
    background: rgba(255, 255, 255, 0.2);
}

.viewer-main {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
}

.viewer-canvas-container {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    overflow: hidden;
    position: relative;
}

#ar-3d-canvas {
    width: 100%;
    height: 600px;
    display: block;
    cursor: grab;
}

#ar-3d-canvas:active {
    cursor: grabbing;
}

.viewer-loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid #00f0ff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.ar-instructions {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}

.instruction-content {
    text-align: center;
    max-width: 400px;
}

.instruction-content h3 {
    margin-bottom: 1.5rem;
    color: #00f0ff;
}

.instruction-content ol {
    text-align: left;
    margin-bottom: 2rem;
}

.instruction-content li {
    margin-bottom: 0.5rem;
}

.start-ar-btn {
    background: linear-gradient(135deg, #00f0ff, #ff00aa);
    border: none;
    border-radius: 8px;
    color: white;
    padding: 0.75rem 2rem;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
}

.start-ar-btn:hover {
    transform: translateY(-2px);
}

.tryon-interface {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    flex-direction: column;
}

.tryon-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    color: white;
}

.close-tryon {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
}

.tryon-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

.camera-view {
    position: relative;
    width: 100%;
    max-width: 400px;
    aspect-ratio: 4/3;
}

#tryon-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
}

#tryon-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.tryon-controls {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}

.capture-btn,
.switch-camera-btn {
    padding: 0.75rem 1.5rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
}

.capture-btn:hover,
.switch-camera-btn:hover {
    background: rgba(255, 255, 255, 0.2);
}

.product-info-panel {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 1.5rem;
}

.product-details h3 {
    color: white;
    margin-bottom: 0.5rem;
}

.product-details p {
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 1rem;
    line-height: 1.5;
}

.product-price {
    margin-bottom: 2rem;
}

.current-price {
    color: #00f0ff;
    font-size: 1.5rem;
    font-weight: 700;
    margin-right: 0.5rem;
}

.original-price {
    color: rgba(255, 255, 255, 0.4);
    text-decoration: line-through;
}

.viewer-controls-panel {
    margin-bottom: 2rem;
}

.viewer-controls-panel h4 {
    color: white;
    margin-bottom: 1rem;
}

.control-group {
    margin-bottom: 1rem;
}

.control-group label {
    display: block;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
}

.control-group input[type="range"] {
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    outline: none;
    -webkit-appearance: none;
}

.control-group input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: #00f0ff;
    border-radius: 50%;
    cursor: pointer;
}

.control-buttons {
    display: flex;
    gap: 0.5rem;
}

.control-btn {
    flex: 1;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    color: white;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

.control-btn:hover {
    background: rgba(255, 255, 255, 0.2);
}

.variant-selector,
.size-selector,
.material-selector {
    margin-bottom: 2rem;
}

.variant-selector h4,
.size-selector h4,
.material-selector h4 {
    color: white;
    margin-bottom: 1rem;
}

.color-options {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.color-option {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid transparent;
    cursor: pointer;
    transition: all 0.3s ease;
}

.color-option.active,
.color-option:hover {
    border-color: #00f0ff;
    transform: scale(1.1);
}

.size-options,
.material-options {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.size-option,
.material-option {
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
}

.size-option.active,
.material-option.active,
.size-option:hover,
.material-option:hover {
    background: rgba(0, 240, 255, 0.2);
    border-color: rgba(0, 240, 255, 0.3);
}

.viewer-actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.action-btn {
    padding: 0.75rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    border: none;
}

.action-btn.primary {
    background: linear-gradient(135deg, #00f0ff, #ff00aa);
    color: white;
}

.action-btn.secondary {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
}

.action-btn:hover {
    transform: translateY(-2px);
}

.room-planner {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 2rem;
}

.planner-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.planner-header h3 {
    color: white;
    margin: 0;
}

.planner-tools {
    display: flex;
    gap: 0.5rem;
}

.tool-btn {
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
}

.tool-btn.active,
.tool-btn:hover {
    background: rgba(0, 240, 255, 0.2);
    border-color: rgba(0, 240, 255, 0.3);
}

.planner-canvas {
    background: white;
    border-radius: 8px;
    margin-bottom: 2rem;
    overflow: hidden;
}

#room-canvas {
    width: 100%;
    height: 400px;
    display: block;
}

.planner-sidebar h4 {
    color: white;
    margin-bottom: 1rem;
}

.furniture-items {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
}

.furniture-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
}

.furniture-item:hover {
    background: rgba(255, 255, 255, 0.1);
}

.item-icon {
    font-size: 2rem;
}

.ar-settings-modal,
.share-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 10000;
}

.ar-settings-content,
.share-content {
    background: linear-gradient(135deg, #1a1a40, #0a0a2a);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.modal-header h3 {
    color: white;
    margin: 0;
}

.close-modal {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    font-size: 1.5rem;
    cursor: pointer;
}

.settings-sections {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.settings-section h4 {
    color: white;
    margin-bottom: 1rem;
}

.quality-options,
.setting-options {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.quality-option,
.setting-option {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.8);
}

.quality-option input,
.setting-option input {
    display: none;
}

.radio-dot {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    position: relative;
    transition: all 0.3s ease;
}

.quality-option input:checked + .radio-dot {
    border-color: #00f0ff;
}

.quality-option input:checked + .radio-dot::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 6px;
    height: 6px;
    background: #00f0ff;
    border-radius: 50%;
}

.checkmark {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    position: relative;
    transition: all 0.3s ease;
}

.setting-option input:checked + .checkmark {
    background: #00f0ff;
    border-color: #00f0ff;
}

.setting-option input:checked + .checkmark::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #000;
    font-size: 10px;
    font-weight: bold;
}

.settings-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
}

.save-settings-btn {
    background: linear-gradient(135deg, #00f0ff, #ff00aa);
    border: none;
    border-radius: 8px;
    color: white;
    padding: 0.75rem 1.5rem;
    cursor: pointer;
    font-weight: 600;
}

.reset-settings-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: white;
    padding: 0.75rem 1.5rem;
    cursor: pointer;
}

.share-options {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.share-link label {
    display: block;
    color: white;
    margin-bottom: 0.5rem;
}

.link-input-group {
    display: flex;
    gap: 0.5rem;
}

.link-input-group input {
    flex: 1;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    color: white;
}

.copy-link-btn {
    padding: 0.75rem 1rem;
    background: rgba(0, 240, 255, 0.2);
    border: 1px solid rgba(0, 240, 255, 0.3);
    border-radius: 6px;
    color: #00f0ff;
    cursor: pointer;
}

.share-buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
}

.share-btn {
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
}

.share-btn:hover {
    background: rgba(255, 255, 255, 0.2);
}

.performance-monitor {
    position: fixed;
    top: 1rem;
    right: 1rem;
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    padding: 1rem;
    color: white;
    font-family: monospace;
    font-size: 0.9rem;
    z-index: 1000;
}

.monitor-stats {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.stat-item {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
}

.stat-label {
    color: rgba(255, 255, 255, 0.6);
}

.stat-value {
    color: #00f0ff;
    font-weight: 600;
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .ar-3d-container {
        padding: 1rem;
    }
    
    .ar-3d-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
    }
    
    .viewer-main {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .view-mode-selector {
        flex-wrap: wrap;
    }
    
    .viewer-controls {
        justify-content: center;
    }
    
    #ar-3d-canvas {
        height: 400px;
    }
    
    .control-buttons {
        flex-direction: column;
    }
    
    .viewer-actions {
        gap: 0.75rem;
    }
    
    .planner-header {
        flex-direction: column;
        gap: 1rem;
    }
    
    .planner-tools {
        justify-content: center;
    }
    
    .furniture-items {
        grid-template-columns: 1fr;
    }
    
    .share-buttons {
        grid-template-columns: 1fr;
    }
    
    .performance-monitor {
        top: auto;
        bottom: 1rem;
        right: 1rem;
    }
    
    /* Mobile-specific 3D canvas optimizations */
    #ar-3d-canvas {
        touch-action: none;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
        outline: none;
        -webkit-tap-highlight-color: transparent;
    }
    
    /* Mobile fallback styling */
    .mobile-3d-fallback {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 400px;
        background: linear-gradient(135deg, #1a1a40, #0a0a2a);
        border-radius: 16px;
        padding: 2rem;
        text-align: center;
    }
    
    .fallback-content {
        color: white;
        max-width: 300px;
    }
    
    .fallback-content h3 {
        margin-bottom: 1rem;
        color: #00f0ff;
    }
    
    .fallback-content p {
        margin-bottom: 2rem;
        opacity: 0.8;
        font-size: 0.9rem;
    }
    
    .fallback-image {
        margin-bottom: 2rem;
        border-radius: 8px;
        overflow: hidden;
    }
    
    .fallback-image img {
        width: 100%;
        height: auto;
        display: block;
    }
    
    .fallback-actions {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .view-gallery-btn,
    .view-details-btn {
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        border: none;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .view-gallery-btn {
        background: linear-gradient(135deg, #00f0ff, #ff00aa);
        color: white;
    }
    
    .view-details-btn {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
    }
    
    /* Touch-friendly controls */
    .view-mode-selector {
        gap: 0.5rem;
    }
    
    .view-mode-btn {
        min-height: 44px; /* iOS touch target minimum */
        padding: 0.75rem 1rem;
        font-size: 0.9rem;
    }
    
    .viewer-controls {
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    .viewer-controls button {
        min-height: 44px;
        padding: 0.75rem 1rem;
        font-size: 0.9rem;
    }
    
    /* Mobile canvas sizing */
    .ar-3d-canvas-container {
        position: relative;
        width: 100%;
        height: 300px; /* Fixed height for mobile */
        min-height: 300px;
        background: linear-gradient(135deg, #1a1a40, #0a0a2a);
        border-radius: 12px;
        overflow: hidden;
    }
    
    #ar-3d-canvas {
        width: 100% !important;
        height: 100% !important;
        display: block;
    }
    
    /* Mobile performance indicator */
    .mobile-performance-warning {
        position: absolute;
        top: 1rem;
        left: 1rem;
        background: rgba(255, 165, 0, 0.9);
        color: white;
        padding: 0.5rem 0.75rem;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 600;
        z-index: 100;
        display: none;
    }
    
    .mobile-performance-warning.show {
        display: block;
    }
}

/* Additional mobile-specific styles for smaller screens */
@media (max-width: 480px) {
    .ar-3d-canvas-container {
        height: 250px;
        min-height: 250px;
    }
    
    .view-mode-selector {
        flex-direction: column;
        width: 100%;
    }
    
    .view-mode-btn {
        width: 100%;
        justify-content: center;
    }
    
    .viewer-controls {
        flex-direction: column;
        width: 100%;
    }
    
    .viewer-controls button {
        width: 100%;
    }
}
</style>
`;

// Include Three.js library with mobile support
const threeJSScript = document.createElement('script');
threeJSScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
threeJSScript.crossOrigin = 'anonymous';
threeJSScript.onload = () => {
    // Wait for DOM to be ready and Three.js to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initializeAR3D();
        });
    } else {
        initializeAR3D();
    }
};

threeJSScript.onerror = () => {
    console.error('Failed to load Three.js library');
    // Fallback for mobile devices
    showMobileFallback();
};

document.head.appendChild(threeJSScript);

function initializeAR3D() {
    // Check if THREE is available
    if (typeof THREE === 'undefined') {
        console.error('Three.js not loaded');
        showMobileFallback();
        return;
    }
    
    // Initialize AR/3D features with mobile optimizations
    window.ar3dFeatures = new AR3DProductFeatures();
}

function showMobileFallback() {
    // Show fallback for devices that don't support 3D
    const ar3dContainer = document.querySelector('.ar-3d-container');
    if (ar3dContainer) {
        ar3dContainer.innerHTML = `
            <div class="mobile-3d-fallback">
                <div class="fallback-content">
                    <h3>3D View Not Available</h3>
                    <p>Your device doesn't support 3D graphics. Please try on a desktop browser or newer mobile device.</p>
                    <div class="fallback-image">
                        <img src="assets/products/product-placeholder.jpg" alt="Product Image">
                    </div>
                    <div class="fallback-actions">
                        <button class="view-gallery-btn">View Product Gallery</button>
                        <button class="view-details-btn">View Product Details</button>
                    </div>
                </div>
            </div>
        `;
    }
}

// Add CSS to head
document.head.insertAdjacentHTML('beforeend', ar3dFeaturesCSS);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AR3DProductFeatures;
}
