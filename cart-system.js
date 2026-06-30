// ============================================
// BREWMATE COMPLETE NAVIGATION & CART SYSTEM
// Save as: cart-system.js
// ============================================

(function() {
    'use strict';

// Cart Management System
class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.deliveryFee = 0;
        this.taxRate = 0.1;
    }

    loadCart() {
        const savedCart = localStorage.getItem('brewmateCart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    saveCart() {
        localStorage.setItem('brewmateCart', JSON.stringify(this.cart));
        this.updateCartCount();
    }

    addItem(item) {
        const existingItem = this.cart.find(cartItem => 
            cartItem.name === item.name && 
            cartItem.size === item.size &&
            cartItem.milk === item.milk &&
            cartItem.sweetness === item.sweetness &&
            cartItem.flavor === item.flavor
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ ...item, quantity: 1 });
        }
        
        this.saveCart();
        return true;
    }

    removeItem(index) {
        this.cart.splice(index, 1);
        this.saveCart();
    }

    updateQuantity(index, quantity) {
        if (quantity <= 0) {
            this.removeItem(index);
        } else {
            this.cart[index].quantity = quantity;
            this.saveCart();
        }
    }

    getCart() {
        return this.cart;
    }

    getSubtotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    getTax() {
        return this.getSubtotal() * this.taxRate;
    }

    getTotal() {
        return this.getSubtotal() + this.getTax() + this.deliveryFee;
    }

    setDeliveryFee(fee) {
        this.deliveryFee = fee;
    }

    getCartCount() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    updateCartCount() {
        const cartCountElements = document.querySelectorAll('#cartCount, .cart-count');
        const count = this.getCartCount();
        cartCountElements.forEach(el => {
            if (el) el.textContent = count;
        });
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
    }
}

// Initialize cart manager
const cartManager = new CartManager();

// ============================================
// NAVIGATION SYSTEM - Works on ALL pages
// ============================================

function setupNavigation() {
    // Cart icon click - go to checkout
    const cartIcons = document.querySelectorAll('.cart-icon');
    cartIcons.forEach(icon => {
        icon.style.cursor = 'pointer';
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'checkout.html';
        });
    });

    // Logo click - go to home
    const logos = document.querySelectorAll('.logo');
    logos.forEach(logo => {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'index.html';
        });
    });

    // Login button click - go to login page
    const loginButtons = document.querySelectorAll('.login-btn');
    loginButtons.forEach(btn => {
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'login.html';
        });
    });

    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const text = link.textContent.trim().toLowerCase();
        
        if (text === 'home') {
            link.href = 'index.html';
        } else if (text === 'menu') {
            link.href = 'menu.html';
        } else if (text === 'about') {
            link.href = 'about.html';
        } else if (text === 'track order') {
            link.href = 'delivery.html';
        } else if (text === 'contact') {
            link.href = 'contact.html';
        }
    });
}

// ============================================
// LOGIN PAGE FUNCTIONALITY
// ============================================

function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (email && password) {
            // Save user login state
            localStorage.setItem('brewmateUser', JSON.stringify({
                email: email,
                loggedIn: true,
                loginTime: new Date().toISOString()
            }));

            // Show loading state
            const btn = loginForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Brewing Your Session...';
            btn.style.background = 'linear-gradient(135deg, #6b4423 0%, #8b6f47 100%)';
            
            // Simulate login process
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }
    });

    // Social login buttons
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            alert('Social login coming soon! Please use email login for now.');
        });
    });
}

// =============// This checks if user is logged in
function checkUserSession() {
    const user = localStorage.getItem('brewmateUser');
    if (user) {
        const userData = JSON.parse(user);
        updateLoginButton(userData);
    }
}

// This updates the login button to show username
function updateLoginButton(userData) {
    const loginButtons = document.querySelectorAll('.login-btn');
    loginButtons.forEach(btn => {
        if (userData && userData.loggedIn) {
            btn.innerHTML = '👤 ' + userData.email.split('@')[0];
            btn.onclick = function() {
                if (confirm('Do you want to logout?')) {
                    localStorage.removeItem('brewmateUser');
                    window.location.reload();
                }
            };
        }
    });
}
// USER SESSION MANAGEMENT
// ============================================

function checkUserSession() {
    const user = localStorage.getItem('brewmateUser');
    if (user) {
        const userData = JSON.parse(user);
        updateLoginButton(userData);
    }
}

function updateLoginButton(userData) {
    const loginButtons = document.querySelectorAll('.login-btn');
    loginButtons.forEach(btn => {
        if (userData && userData.loggedIn) {
            btn.innerHTML = '👤 ' + userData.email.split('@')[0];
            btn.onclick = function() {
                if (confirm('Do you want to logout?')) {
                    localStorage.removeItem('brewmateUser');
                    window.location.reload();
                }
            };
        }
    });
}

// ============================================
// MENU PAGE FUNCTIONALITY
// ============================================

function initMenuPage() {
    if (!document.querySelector('.menu-page')) return;

    let selectedCoffee = null;
    let selectedSize = 'medium';

    const coffeeOptions = document.querySelectorAll('.option-card');
    const sizeButtons = document.querySelectorAll('.size-btn');
    const addToCartBtn = document.getElementById('addToCart');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // Coffee selection
    coffeeOptions.forEach(card => {
        card.addEventListener('click', function() {
            coffeeOptions.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            selectedCoffee = {
                name: this.querySelector('h4').textContent,
                basePrice: parseFloat(this.querySelector('.price, p').textContent.replace('$', '')),
                emoji: this.querySelector('.option-icon').textContent
            };
        });
    });

    // Size selection
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            sizeButtons.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            selectedSize = this.dataset.size;
        });
    });

    // Set default selections
    if (coffeeOptions.length > 0) {
        coffeeOptions[0].click();
    }
    if (sizeButtons.length > 1) {
        sizeButtons[1].click(); // Select medium by default
    }

    // Add to cart
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            if (!selectedCoffee) {
                alert('Please select a coffee type');
                return;
            }

            const milkType = document.getElementById('milkType')?.value || 'regular';
            const sweetness = document.getElementById('sweetness')?.value || 'none';
            const extraShots = parseInt(document.getElementById('extraShots')?.value || 0);
            const flavor = document.getElementById('flavor')?.value || 'none';

            // Calculate price based on size and extras
            let price = selectedCoffee.basePrice;
            if (selectedSize === 'large') price += 1;
            if (selectedSize === 'small') price -= 0.5;
            price += extraShots * 0.5;

            const item = {
                name: selectedCoffee.name,
                price: price,
                emoji: selectedCoffee.emoji,
                description: `${selectedSize.charAt(0).toUpperCase() + selectedSize.slice(1)}, ${milkType} milk`,
                size: selectedSize,
                milk: milkType,
                sweetness: sweetness,
                flavor: flavor,
                extraShots: extraShots
            };

            cartManager.addItem(item);
            showCoffeeAnimation();
            updateCartPreview();
            
            // Show success message
            showNotification('Added to cart! ☕');
        });
    }

    // Checkout button - go to checkout page
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cartManager.getCartCount() === 0) {
                alert('Your cart is empty!');
                return;
            }
            window.location.href = 'checkout.html';
        });
    }

    // Update cart preview
    updateCartPreview();
}

function showCoffeeAnimation() {
    const animation = document.getElementById('coffeeAnimation');
    if (!animation) return;

    animation.style.display = 'block';
    const steps = animation.querySelectorAll('.step');
    
    steps.forEach((step, index) => {
        setTimeout(() => {
            steps.forEach(s => s.classList.remove('step-active'));
            step.classList.add('step-active');
            
            if (index === steps.length - 1) {
                setTimeout(() => {
                    animation.style.display = 'none';
                }, 1000);
            }
        }, index * 800);
    });
}

function updateCartPreview() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    
    if (!cartItemsContainer) return;

    const cart = cartManager.getCart();
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: #b8956f; padding: 20px;">Your cart is empty</p>';
        if (cartTotalElement) cartTotalElement.textContent = '0.00';
        return;
    }

    let html = '';
    cart.forEach((item, index) => {
        html += `
            <div class="cart-item-preview">
                <span>${item.emoji} ${item.name}</span>
                <span>x${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
                <button onclick="window.BrewMateCart.removeItem(${index}); window.updateCartPreview();" class="remove-item-btn">×</button>
            </div>
        `;
    });

    cartItemsContainer.innerHTML = html;
    if (cartTotalElement) {
        cartTotalElement.textContent = cartManager.getSubtotal().toFixed(2);
    }
}

// ============================================
// CHECKOUT PAGE FUNCTIONALITY
// ============================================

function initCheckoutPage() {
    if (!document.querySelector('.checkout-container')) return;

    // Override the old functions with new navigation
    window.goHome = function() {
        window.location.href = 'menu.html';
    };

    window.viewCheckout = function() {
        // Already on checkout
    };

    window.proceedCheckout = function() {
        if (cartManager.getCartCount() === 0) {
            alert('Your cart is empty!');
            return;
        }

        // Save order details
        const orderDetails = {
            items: cartManager.getCart(),
            subtotal: cartManager.getSubtotal(),
            tax: cartManager.getTax(),
            deliveryFee: cartManager.deliveryFee,
            total: cartManager.getTotal(),
            deliveryMethod: document.querySelector('input[name="delivery"]:checked')?.value || 'standard',
            orderTime: new Date().toISOString()
        };

        localStorage.setItem('currentOrder', JSON.stringify(orderDetails));
        
        // Clear cart after order
        cartManager.clearCart();
        
        // Redirect to delivery tracking
        window.location.href = 'delivery.html';
    };

    // Continue shopping button
    const continueShoppingBtn = document.querySelector('.continue-shopping');
    if (continueShoppingBtn) {
        continueShoppingBtn.onclick = function() {
            window.location.href = 'menu.html';
        };
    }

    // Checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.onclick = window.proceedCheckout;
    }

    // Override functions for quantity controls
    window.increaseQty = function(index) {
        updateCheckoutQuantity(index, 1);
    };

    window.decreaseQty = function(index) {
        updateCheckoutQuantity(index, -1);
    };

    window.removeItem = function(index) {
        removeCheckoutItem(index);
    };

    window.updateDelivery = function() {
        const deliveryMethod = document.querySelector('input[name="delivery"]:checked').value;
        if (deliveryMethod === 'express') {
            cartManager.setDeliveryFee(5);
        } else {
            cartManager.setDeliveryFee(0);
        }
        updateCheckoutSummary();
    };

    renderCheckoutCart();
    updateCheckoutSummary();
}

function renderCheckoutCart() {
    const container = document.getElementById('cartItemsContainer');
    if (!container) return;

    const cart = cartManager.getCart();
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <p>Your cart is empty. Continue shopping to add items!</p>
            </div>
        `;
        return;
    }

    let html = '';
    cart.forEach((item, index) => {
        html += `
            <div class="cart-item">
                <div class="item-image">${item.emoji}</div>
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-description">${item.description}</div>
                    <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
                <div class="item-controls">
                    <button class="qty-btn" onclick="decreaseQty(${index})">−</button>
                    <div class="qty-display">${item.quantity}</div>
                    <button class="qty-btn" onclick="increaseQty(${index})">+</button>
                    <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function updateCheckoutQuantity(index, change) {
    const cart = cartManager.getCart();
    const newQuantity = cart[index].quantity + change;
    cartManager.updateQuantity(index, newQuantity);
    renderCheckoutCart();
    updateCheckoutSummary();
}

function removeCheckoutItem(index) {
    cartManager.removeItem(index);
    renderCheckoutCart();
    updateCheckoutSummary();
}

function updateCheckoutSummary() {
    const subtotal = cartManager.getSubtotal();
    const tax = cartManager.getTax();
    const total = cartManager.getTotal();

    const subtotalEl = document.getElementById('subtotal');
    const deliveryFeeEl = document.getElementById('deliveryFee');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = subtotal.toFixed(2);
    if (deliveryFeeEl) deliveryFeeEl.textContent = cartManager.deliveryFee.toFixed(2);
    if (taxEl) taxEl.textContent = tax.toFixed(2);
    if (totalEl) totalEl.textContent = total.toFixed(2);
}

// ============================================
// DELIVERY PAGE FUNCTIONALITY
// ============================================

function initDeliveryPage() {
    if (!document.querySelector('.delivery-page')) return;

    const orderDetails = JSON.parse(localStorage.getItem('currentOrder'));
    
    if (!orderDetails) {
        const container = document.querySelector('.delivery-tracker');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #b8956f;">
                    <h2>No active orders</h2>
                    <p>Place an order to track your delivery!</p>
                    <button onclick="window.location.href='menu.html'" style="margin-top: 20px; padding: 10px 20px; background: var(--accent-color); color: var(--dark-color); border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Go to Menu</button>
                </div>
            `;
        }
        return;
    }

    // Initialize map if available
    initializeMap();
    
    // Start delivery animation
    animateDelivery();
}

function initializeMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement || typeof L === 'undefined') return;

    const map = L.map('map').setView([24.8607, 67.0011], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const restaurantMarker = L.marker([24.8607, 67.0011]).addTo(map)
        .bindPopup('BrewMate Cafe');

    const deliveryMarker = L.marker([24.8707, 67.0211]).addTo(map)
        .bindPopup('Your Location');
}

function animateDelivery() {
    const deliveryMan = document.querySelector('.delivery-man');
    if (!deliveryMan) return;

    deliveryMan.style.animation = 'deliveryMove 15s linear infinite';
    
    setTimeout(() => updateDeliveryStatus(3), 3000);
    setTimeout(() => updateDeliveryStatus(4), 12000);
}

function updateDeliveryStatus(step) {
    const steps = document.querySelectorAll('.status-step');
    const lines = document.querySelectorAll('.status-line');
    
    steps.forEach((s, index) => {
        if (index < step) {
            s.classList.add('completed');
            s.classList.remove('active');
        } else if (index === step) {
            s.classList.add('active');
        }
    });

    lines.forEach((line, index) => {
        if (index < step - 1) {
            line.classList.add('completed');
        }
    });

    if (step === 4) {
        setTimeout(() => {
            alert('Your order has been delivered! Enjoy your coffee ☕');
        }, 1000);
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// ============================================
// PAGE INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Setup navigation on all pages
    setupNavigation();
    
    // Check user session and update UI
    checkUserSession();
    
    // Update cart count on all pages
    cartManager.updateCartCount();

    // Initialize appropriate page
    initMenuPage();
    initCheckoutPage();
    initDeliveryPage();
    initLoginPage();

    // Add CSS for animations and styles
    if (!document.getElementById('brewmate-styles')) {
        const style = document.createElement('style');
        style.id = 'brewmate-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(400px); opacity: 0; }
            }
            @keyframes deliveryMove {
                0% { left: 0; }
                100% { left: 80%; }
            }
            .selected {
                border: 3px solid var(--accent-color) !important;
                transform: scale(1.05);
                box-shadow: 0 8px 20px rgba(212, 165, 116, 0.4) !important;
            }
            .cart-item-preview {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
                background: var(--dark-color);
                border-radius: 6px;
                margin-bottom: 8px;
                gap: 10px;
            }
            .cart-item-preview span:first-child {
                flex: 1;
            }
            .remove-item-btn {
                background: #d32f2f;
                color: white;
                border: none;
                width: 25px;
                height: 25px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 18px;
                line-height: 1;
                transition: all 0.3s;
            }
            .remove-item-btn:hover {
                background: #b71c1c;
                transform: scale(1.1);
            }
        `;
        document.head.appendChild(style);
    }
});

// Make functions globally available
window.BrewMateCart = cartManager;
window.updateCartPreview = updateCartPreview;
window.updateCheckoutQuantity = updateCheckoutQuantity;
window.removeCheckoutItem = removeCheckoutItem;

})(); // End of IIFE wrapper