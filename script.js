// script.js
// Laboratory 6: DOM Scripting - Dynamic E-commerce Application

// ============================================
// Task 1: Data Structure - Product Class
// ============================================

class Product {
    constructor(id, name, price, image, description = '', category = '') {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.description = description;
        this.category = category;
    }
}

// Product Database - 10+ products for testing
const products = [
    new Product(1, 'Smart Watch Pro', 3999, 'images/smartwatch.jpg', 'Track your fitness, heart rate, and receive notifications', 'wearables'),
    new Product(2, 'Wireless Headphones', 2499, 'images/headphones.jpg', 'High-quality sound with noise cancellation and 20hr battery life', 'audio'),
    new Product(3, 'Bluetooth Speaker', 1899, 'images/speaker.jpg', 'Portable speaker with deep bass and waterproof design', 'audio'),
    new Product(4, 'Mechanical Keyboard', 2999, 'images/keyboard.jpg', 'RGB backlit with blue switches for satisfying typing experience', 'accessories'),
    new Product(5, 'Gaming Mouse', 1899, 'images/mouse.jpg', '16,000 DPI with customizable RGB lighting', 'accessories'),
    new Product(6, '15" Portable Monitor', 5999, 'images/monitor.jpg', 'USB-C powered, perfect for laptop dual-screen setup', 'electronics'),
    new Product(7, 'USB-C Hub', 1299, 'images/usbhub.jpg', '7-in-1 multiport adapter with 4K HDMI', 'electronics'),
    new Product(8, 'Phone Stand', 399, 'images/stand.jpg', 'Adjustable aluminum phone stand', 'accessories'),
    new Product(9, 'Power Bank', 1499, 'images/powerbank.jpg', '20000mAh fast charging power bank', 'electronics'),
    new Product(10, 'Smart Light Bulb', 799, 'images/lightbulb.jpg', 'Wi-Fi enabled color-changing smart bulb', 'electronics'),
    new Product(11, 'Wireless Charger', 899, 'images/charger.jpg', '15W fast wireless charging pad', 'accessories'),
    new Product(12, 'Fitness Tracker', 2299, 'images/fitness.jpg', 'Activity tracker with heart rate monitor', 'wearables')
];

// ============================================
// Global State Management
// ============================================

// Cart array - stores cart items with quantity
let cart = [];

// Load cart from localStorage on page load
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('ecommerceCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('ecommerceCart', JSON.stringify(cart));
}

// Current user mock data (Task 5)
const currentUser = {
    name: 'John Doe',
    orderHistory: [
        { id: 'ORD-001', date: 'March 10, 2026', total: 10896, items: ['Smart Watch Pro', 'Wireless Headphones x2', 'Bluetooth Speaker'], status: 'Delivered' },
        { id: 'ORD-002', date: 'February 25, 2026', total: 4898, items: ['Mechanical Keyboard', 'Gaming Mouse'], status: 'Delivered' },
        { id: 'ORD-003', date: 'March 12, 2026', total: 5999, items: ['15" Portable Monitor'], status: 'In Transit' }
    ]
};

// ============================================
// Helper Functions
// ============================================

// Format price with currency symbol
function formatPrice(price) {
    return `₱${price.toLocaleString()}`;
}

// Find product by ID
function findProductById(id) {
    return products.find(p => p.id === parseInt(id));
}

// ============================================
// Task 2: Dynamic Product Rendering (products.html)
// ============================================

function renderProducts() {
    const productGrid = document.querySelector('.products-container');
    if (!productGrid) return;
    
    // Clear existing content
    productGrid.innerHTML = '';
    
    // Loop through products and create cards
    products.forEach(product => {
        const article = document.createElement('article');
        article.className = 'product-card';
        article.setAttribute('data-product-id', product.id);
        
        // Product Image
        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.name;
        img.className = 'product-image';
        
        // Product Title
        const title = document.createElement('h2');
        title.className = 'product-title';
        title.textContent = product.name;
        
        // Product Price
        const price = document.createElement('p');
        price.className = 'product-price';
        price.textContent = formatPrice(product.price);
        
        // Product Description
        const desc = document.createElement('p');
        desc.className = 'product-description';
        desc.textContent = product.description;
        
        // View Details Link
        const detailsLink = document.createElement('a');
        detailsLink.href = `detail.html?id=${product.id}`;
        detailsLink.className = 'view-details';
        detailsLink.textContent = 'View Details →';
        
        // Add to Cart Button
        const addButton = document.createElement('button');
        addButton.textContent = 'Add to Cart';
        addButton.className = 'add-to-cart-btn';
        addButton.setAttribute('data-id', product.id);
        
        // Assemble the card
        article.appendChild(img);
        article.appendChild(title);
        article.appendChild(price);
        article.appendChild(desc);
        article.appendChild(detailsLink);
        article.appendChild(addButton);
        
        productGrid.appendChild(article);
    });
}

// ============================================
// Task 3: Cart Functionality
// ============================================

// Add item to cart
function addToCart(productId, quantity = 1) {
    const product = findProductById(productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    saveCartToStorage();
    renderCart(); // Re-render cart if on cart page
    updateCartIcon(); // Update cart icon badge
    
    // Task 6: Add animation feedback
    animateAddToCart(productId);
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    renderCart();
    updateCartIcon();
}

// Update item quantity
function updateCartQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCartToStorage();
        renderCart();
        updateCartIcon();
    }
}

// Calculate cart total
function calculateCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Calculate item total
function calculateItemTotal(price, quantity) {
    return price * quantity;
}

// Render cart on cart.html
function renderCart() {
    const cartList = document.querySelector('.cart-items');
    const cartEmpty = document.querySelector('.cart-empty');
    const cartActive = document.querySelector('.cart-active');
    
    if (!cartList) return;
    
    // Show/hide empty cart message
    if (cart.length === 0) {
        if (cartEmpty) cartEmpty.style.display = 'block';
        if (cartActive) cartActive.style.display = 'none';
        return;
    }
    
    if (cartEmpty) cartEmpty.style.display = 'none';
    if (cartActive) cartActive.style.display = 'block';
    
    // Clear and rebuild cart list
    cartList.innerHTML = '';
    
    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'cart-item';
        li.setAttribute('data-cart-id', item.id);
        
        // Image
        const imageDiv = document.createElement('div');
        imageDiv.className = 'item-image';
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.name;
        imageDiv.appendChild(img);
        
        // Details
        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'item-details';
        const name = document.createElement('h3');
        name.className = 'item-name';
        name.textContent = item.name;
        const price = document.createElement('p');
        price.className = 'item-price';
        price.textContent = `${formatPrice(item.price)} each`;
        detailsDiv.appendChild(name);
        detailsDiv.appendChild(price);
        
        // Quantity Input
        const quantityDiv = document.createElement('div');
        quantityDiv.className = 'item-quantity';
        const quantityLabel = document.createElement('label');
        quantityLabel.htmlFor = `quantity-${item.id}`;
        quantityLabel.className = 'visually-hidden';
        quantityLabel.textContent = 'Quantity';
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.id = `quantity-${item.id}`;
        quantityInput.name = 'quantity';
        quantityInput.value = item.quantity;
        quantityInput.min = '1';
        quantityInput.max = '10';
        quantityInput.className = 'quantity-input';
        quantityInput.addEventListener('change', (e) => {
            updateCartQuantity(item.id, parseInt(e.target.value));
        });
        quantityDiv.appendChild(quantityLabel);
        quantityDiv.appendChild(quantityInput);
        
        // Item Total
        const totalDiv = document.createElement('div');
        totalDiv.className = 'item-total';
        const totalPrice = document.createElement('p');
        totalPrice.className = 'item-total-price';
        totalPrice.textContent = formatPrice(calculateItemTotal(item.price, item.quantity));
        totalDiv.appendChild(totalPrice);
        
        // Remove Button
        const removeDiv = document.createElement('div');
        removeDiv.className = 'item-remove';
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.innerHTML = '✕';
        removeBtn.setAttribute('aria-label', 'Remove item');
        removeBtn.addEventListener('click', () => removeFromCart(item.id));
        removeDiv.appendChild(removeBtn);
        
        li.appendChild(imageDiv);
        li.appendChild(detailsDiv);
        li.appendChild(quantityDiv);
        li.appendChild(totalDiv);
        li.appendChild(removeDiv);
        
        cartList.appendChild(li);
    });
    
    // Update subtotal
    const subtotalElement = document.querySelector('.subtotal-amount');
    if (subtotalElement) {
        subtotalElement.textContent = formatPrice(calculateCartTotal());
    }
    
    // Update checkout page summary if present
    updateCheckoutSummary();
}

// Update cart icon with item count
function updateCartIcon() {
    const cartIcon = document.querySelector('.icon-link[aria-label="Shopping Cart"]');
    if (!cartIcon) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Remove existing badge if present
    const existingBadge = cartIcon.querySelector('.cart-badge');
    if (existingBadge) existingBadge.remove();
    
    // Add new badge if items exist
    if (totalItems > 0) {
        const badge = document.createElement('span');
        badge.className = 'cart-badge';
        badge.textContent = totalItems > 99 ? '99+' : totalItems;
        cartIcon.style.position = 'relative';
        cartIcon.appendChild(badge);
    }
}

// ============================================
// Task 4: Form Validation & Submission (checkout.html)
// ============================================

// Task 4: Form Validation & Submission (checkout.html)
function initCheckoutForm() {
    const checkoutForm = document.querySelector('.checkout-form');
    if (!checkoutForm) return;
    
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        const errors = [];
        
        // Clear previous errors
        const errorContainer = document.querySelector('.form-errors');
        if (errorContainer) {
            errorContainer.innerHTML = '';
            errorContainer.style.display = 'none';
        }
        
        // Remove existing error classes
        document.querySelectorAll('.error').forEach(field => {
            field.classList.remove('error');
        });
        
        // Get all required fields
        const requiredFields = checkoutForm.querySelectorAll('[required]');
        
        // Also check credit card fields if credit card is selected
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked');
        if (paymentMethod && paymentMethod.value === 'credit-card') {
            const cardNumber = document.querySelector('#card-number');
            const expiryMonth = document.querySelector('#expiry-month');
            const expiryYear = document.querySelector('#expiry-year');
            const cvv = document.querySelector('#cvv');
            const cardName = document.querySelector('#card-name');
            
            if (cardNumber && !cardNumber.value.trim()) {
                isValid = false;
                cardNumber.classList.add('error');
                errors.push('Card number is required');
            } else if (cardNumber && cardNumber.value.trim().replace(/\s/g, '').length < 15) {
                isValid = false;
                cardNumber.classList.add('error');
                errors.push('Please enter a valid card number');
            }
            
            if (expiryMonth && !expiryMonth.value) {
                isValid = false;
                expiryMonth.classList.add('error');
                errors.push('Expiry month is required');
            }
            
            if (expiryYear && !expiryYear.value) {
                isValid = false;
                expiryYear.classList.add('error');
                errors.push('Expiry year is required');
            }
            
            if (cvv && !cvv.value.trim()) {
                isValid = false;
                cvv.classList.add('error');
                errors.push('CVV is required');
            } else if (cvv && cvv.value.trim().length < 3) {
                isValid = false;
                cvv.classList.add('error');
                errors.push('Please enter a valid CVV (3 digits)');
            }
            
            if (cardName && !cardName.value.trim()) {
                isValid = false;
                cardName.classList.add('error');
                errors.push('Name on card is required');
            }
        }
        
        // Validate all required fields
        requiredFields.forEach(field => {
            // Skip credit card fields if they're hidden
            if (field.closest('#creditCardDetails') && 
                document.querySelector('#creditCardDetails') && 
                document.querySelector('#creditCardDetails').style.display === 'none') {
                return;
            }
            
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
                const label = field.previousElementSibling?.textContent || field.placeholder || 'Field';
                errors.push(`${label.replace('*', '')} is required`);
            }
        });
        
        // Validate email format
        const emailField = checkoutForm.querySelector('#email');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                isValid = false;
                emailField.classList.add('error');
                errors.push('Please enter a valid email address');
            }
        }
        
        // Validate phone number
        const phoneField = checkoutForm.querySelector('#phone');
        if (phoneField && phoneField.value) {
            const phoneRegex = /^[\+\d\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(phoneField.value.replace(/\s/g, ''))) {
                isValid = false;
                phoneField.classList.add('error');
                errors.push('Please enter a valid phone number');
            }
        }
        
        // Validate ZIP code
        const zipField = checkoutForm.querySelector('#zip-code');
        if (zipField && zipField.value) {
            const zipRegex = /^\d{4}$/;
            if (!zipRegex.test(zipField.value)) {
                isValid = false;
                zipField.classList.add('error');
                errors.push('Please enter a valid ZIP code (4 digits)');
            }
        }
        
        // Display error messages
        if (errorContainer) {
            if (!isValid) {
                errorContainer.innerHTML = errors.map(err => `<p class="error-message">⚠️ ${err}</p>`).join('');
                errorContainer.style.display = 'block';
                // Scroll to top of form
                errorContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                errorContainer.style.display = 'none';
                console.log('Form validated successfully!');
                
                // Check if cart is empty
                if (cart.length === 0) {
                    alert('Your cart is empty! Please add items before checking out.');
                    window.location.href = 'products.html';
                    return;
                }
                
                // Simulate order placement
                alert('Order placed successfully! Thank you for your purchase.');
                // Clear cart
                cart = [];
                saveCartToStorage();
                updateCartIcon();
                window.location.href = 'landing.html';
            }
        }
    });
}

// ============================================
// Task 5: User Account & Order History (account.html)
// ============================================

function initAccountPage() {
    // Dynamic greeting
    const welcomeHeader = document.querySelector('main > header:first-of-type h1');
    if (welcomeHeader) {
        welcomeHeader.textContent = `Welcome back, ${currentUser.name}!`;
    }
    
    // Add event listeners to details/summary for dynamic order injection
    const detailsElements = document.querySelectorAll('#order-history details');
    
    detailsElements.forEach((details, index) => {
        const summary = details.querySelector('summary');
        if (!summary) return;
        
        // Store order data on the element
        if (currentUser.orderHistory[index]) {
            details.setAttribute('data-order-id', currentUser.orderHistory[index].id);
        }
        
        summary.addEventListener('click', (e) => {
            // Prevent multiple injections
            if (details.querySelector('.dynamic-order-details')) return;
            
            const order = currentUser.orderHistory[index];
            if (!order) return;
            
            // Create dynamic content
            const orderDetailsDiv = document.createElement('div');
            orderDetailsDiv.className = 'dynamic-order-details';
            orderDetailsDiv.style.marginTop = '1rem';
            orderDetailsDiv.style.padding = '1rem';
            orderDetailsDiv.style.backgroundColor = '#f8f9fa';
            orderDetailsDiv.style.borderRadius = '4px';
            
            // Build items list
            const itemsList = order.items.map(item => `<li>${item}</li>`).join('');
            
            orderDetailsDiv.innerHTML = `
                <h4>Order Details</h4>
                <p><strong>Order ID:</strong> ${order.id}</p>
                <p><strong>Date:</strong> ${order.date}</p>
                <p><strong>Status:</strong> <span style="color: ${order.status === 'Delivered' ? 'green' : 'blue'}">${order.status}</span></p>
                <p><strong>Items:</strong></p>
                <ul>${itemsList}</ul>
                <p><strong>Total:</strong> ${formatPrice(order.total)}</p>
            `;
            
            // Find where to insert (after the summary's existing content)
            const summaryContent = summary.querySelector('div');
            if (summaryContent) {
                summaryContent.appendChild(orderDetailsDiv);
            } else {
                // Create a container if it doesn't exist
                const contentDiv = document.createElement('div');
                contentDiv.appendChild(orderDetailsDiv);
                summary.appendChild(contentDiv);
            }
        });
    });
}

// ============================================
// Task 6: Interactive Feedback (Animations)
// ============================================

function animateAddToCart(productId) {
    const productCard = document.querySelector(`.product-card[data-product-id="${productId}"]`);
    if (productCard) {
        productCard.classList.add('fade-in');
        setTimeout(() => {
            productCard.classList.remove('fade-in');
        }, 500);
    }
}

// ============================================
// Product Detail Page Rendering
// ============================================

function renderProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) return;
    
    const product = findProductById(productId);
    if (!product) return;
    
    // Update page content dynamically
    const productName = document.querySelector('.product-info h1');
    const productPrice = document.querySelector('.product-price');
    const productImage = document.querySelector('.main-image');
    const productDescription = document.querySelector('.product-description');
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    
    if (productName) productName.textContent = product.name;
    if (productPrice) productPrice.textContent = formatPrice(product.price);
    if (productImage) productImage.src = product.image;
    if (productDescription) productDescription.textContent = product.description;
    
    // Update Add to Cart button
    if (addToCartBtn) {
        addToCartBtn.setAttribute('data-id', product.id);
        
        // Remove existing event listener and add new one
        const newBtn = addToCartBtn.cloneNode(true);
        addToCartBtn.parentNode.replaceChild(newBtn, addToCartBtn);
        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const quantitySelect = document.querySelector('#quantity');
            const quantity = quantitySelect ? parseInt(quantitySelect.value) : 1;
            addToCart(product.id, quantity);
            
            // Animation feedback
            newBtn.classList.add('pulse');
            setTimeout(() => newBtn.classList.remove('pulse'), 300);
        });
    }
    
    // Update related products
    updateRelatedProducts(product);
}

function updateRelatedProducts(currentProduct) {
    const relatedGrid = document.querySelector('.related-grid');
    if (!relatedGrid) return;
    
    // Get products from same category or random
    const relatedProducts = products
        .filter(p => p.id !== currentProduct.id && p.category === currentProduct.category)
        .slice(0, 3);
    
    if (relatedProducts.length < 3) {
        const otherProducts = products.filter(p => p.id !== currentProduct.id && p.category !== currentProduct.category);
        while (relatedProducts.length < 3 && otherProducts.length) {
            relatedProducts.push(otherProducts.shift());
        }
    }
    
    relatedGrid.innerHTML = '';
    relatedProducts.forEach(product => {
        const article = document.createElement('article');
        article.className = 'related-item';
        
        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.name;
        
        const title = document.createElement('h4');
        title.textContent = product.name;
        
        const price = document.createElement('p');
        price.textContent = formatPrice(product.price);
        
        const link = document.createElement('a');
        link.href = `detail.html?id=${product.id}`;
        link.className = 'view-link';
        link.textContent = 'View Details';
        
        article.appendChild(img);
        article.appendChild(title);
        article.appendChild(price);
        article.appendChild(link);
        
        relatedGrid.appendChild(article);
    });
}

// ============================================
// Update Checkout Summary
// ============================================

function updateCheckoutSummary() {
    const summaryItems = document.querySelector('.summary-items');
    const totalAmount = document.querySelector('.total-amount');
    const subtotalElement = document.querySelector('.summary-row:first-child span:last-child');
    
    if (!summaryItems) return;
    
    // Clear and rebuild summary items
    const itemsContainer = summaryItems.querySelector('.summary-items-container') || summaryItems;
    const originalH3 = summaryItems.querySelector('h3');
    
    // Clear items but keep the h3
    const itemElements = summaryItems.querySelectorAll('.summary-item');
    itemElements.forEach(el => el.remove());
    
    // Add current cart items
    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'summary-item';
        itemDiv.innerHTML = `
            <div class="summary-item-details">
                <span class="summary-item-name">${item.name}</span>
                <span class="summary-item-quantity">x${item.quantity}</span>
            </div>
            <span class="summary-item-price">${formatPrice(item.price * item.quantity)}</span>
        `;
        if (originalH3 && originalH3.nextSibling) {
            summaryItems.insertBefore(itemDiv, originalH3.nextSibling);
        } else {
            summaryItems.appendChild(itemDiv);
        }
    });
    
    // Update totals
    const total = calculateCartTotal();
    if (totalAmount) totalAmount.textContent = formatPrice(total);
    if (subtotalElement && subtotalElement.parentElement?.parentElement?.querySelector('.summary-row:first-child')) {
        const subtotalRow = document.querySelector('.summary-row:first-child span:last-child');
        if (subtotalRow) subtotalRow.textContent = formatPrice(total);
    }
}

// ============================================
// Event Delegation for Add to Cart (Task 3)
// ============================================

function initEventDelegation() {
    // Global click listener for Add to Cart buttons
    document.body.addEventListener('click', (e) => {
        // Check if clicked element or its parent is an Add to Cart button
        const addButton = e.target.closest('.add-to-cart-btn');
        if (addButton) {
            e.preventDefault();
            const productId = addButton.getAttribute('data-id');
            if (productId) {
                addToCart(parseInt(productId));
                
                // Show feedback message
                showToast('Item added to cart!');
            }
        }
    });
}

// Toast notification helper
function showToast(message) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #28a745;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// ============================================
// Filter Functionality (products.html)
// ============================================

function initFilters() {
    const applyFiltersBtn = document.querySelector('.apply-filters');
    if (!applyFiltersBtn) return;
    
    applyFiltersBtn.addEventListener('click', () => {
        // Get selected categories
        const selectedCategories = Array.from(document.querySelectorAll('.filter-sidebar input[type="checkbox"]'))
            .filter(cb => cb.checked && cb.name === 'category')
            .map(cb => cb.value);
        
        // Get selected price range
        const selectedPrice = document.querySelector('.filter-sidebar input[type="radio"]:checked');
        const priceValue = selectedPrice ? selectedPrice.value : null;
        
        // Filter products
        let filteredProducts = [...products];
        
        if (selectedCategories.length > 0) {
            filteredProducts = filteredProducts.filter(p => selectedCategories.includes(p.category));
        }
        
        if (priceValue) {
            switch(priceValue) {
                case 'under1000':
                    filteredProducts = filteredProducts.filter(p => p.price < 1000);
                    break;
                case '1000to3000':
                    filteredProducts = filteredProducts.filter(p => p.price >= 1000 && p.price <= 3000);
                    break;
                case '3000to5000':
                    filteredProducts = filteredProducts.filter(p => p.price > 3000 && p.price <= 5000);
                    break;
                case 'over5000':
                    filteredProducts = filteredProducts.filter(p => p.price > 5000);
                    break;
            }
        }
        
        // Re-render filtered products
        const productGrid = document.querySelector('.products-container');
        if (productGrid) {
            productGrid.innerHTML = '';
            filteredProducts.forEach(product => {
                const article = document.createElement('article');
                article.className = 'product-card';
                article.setAttribute('data-product-id', product.id);
                
                const img = document.createElement('img');
                img.src = product.image;
                img.alt = product.name;
                img.className = 'product-image';
                
                const title = document.createElement('h2');
                title.className = 'product-title';
                title.textContent = product.name;
                
                const price = document.createElement('p');
                price.className = 'product-price';
                price.textContent = formatPrice(product.price);
                
                const desc = document.createElement('p');
                desc.className = 'product-description';
                desc.textContent = product.description;
                
                const detailsLink = document.createElement('a');
                detailsLink.href = `detail.html?id=${product.id}`;
                detailsLink.className = 'view-details';
                detailsLink.textContent = 'View Details →';
                
                const addButton = document.createElement('button');
                addButton.textContent = 'Add to Cart';
                addButton.className = 'add-to-cart-btn';
                addButton.setAttribute('data-id', product.id);
                
                article.appendChild(img);
                article.appendChild(title);
                article.appendChild(price);
                article.appendChild(desc);
                article.appendChild(detailsLink);
                article.appendChild(addButton);
                
                productGrid.appendChild(article);
            });
        }
    });
}

// ============================================
// Initialize all pages based on current page
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Load cart from storage
    loadCartFromStorage();
    
    // Get current page path
    const currentPage = window.location.pathname.split('/').pop() || 'landing.html';
    
    // Initialize based on page
    switch(currentPage) {
        case 'products.html':
            renderProducts();
            initFilters();
            break;
        case 'cart.html':
            renderCart();
            break;
        case 'detail.html':
            renderProductDetail();
            break;
        case 'checkout.html':
            updateCheckoutSummary();
            initCheckoutForm();
            break;
        case 'account.html':
            initAccountPage();
            break;
        case 'landing.html':
            // Render featured products on landing page
            renderFeaturedProducts();
            break;
    }
    
    // Initialize event delegation for all pages
    initEventDelegation();
    
    // Update cart icon on all pages
    updateCartIcon();
});

// Render featured products for landing page
function renderFeaturedProducts() {
    const featuredGrid = document.querySelector('#featured-products .products-grid');
    const discountedGrid = document.querySelector('#discounted-products .products-grid');
    
    if (featuredGrid) {
        const featuredProducts = products.slice(0, 3);
        featuredGrid.innerHTML = '';
        featuredProducts.forEach(product => {
            const article = createProductCard(product);
            featuredGrid.appendChild(article);
        });
    }
    
    if (discountedGrid) {
        const discountedProducts = products.slice(3, 5);
        discountedGrid.innerHTML = '';
        discountedProducts.forEach(product => {
            const article = createProductCard(product);
            // Add discount styling
            const priceElement = article.querySelector('.product-price');
            if (priceElement) {
                const discountPrice = product.price * 0.7;
                priceElement.innerHTML = `<del>${formatPrice(product.price)}</del> <strong>${formatPrice(discountPrice)}</strong> <em>(Save 30%!)</em>`;
            }
            discountedGrid.appendChild(article);
        });
    }
}

function createProductCard(product) {
    const article = document.createElement('article');
    
    const title = document.createElement('h3');
    title.textContent = product.name;
    
    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;
    
    const desc = document.createElement('p');
    desc.textContent = product.description;
    
    const price = document.createElement('p');
    price.textContent = formatPrice(product.price);
    
    const button = document.createElement('button');
    button.textContent = 'Add to Cart';
    button.setAttribute('data-id', product.id);
    button.className = 'add-to-cart-btn';
    
    article.appendChild(title);
    article.appendChild(img);
    article.appendChild(desc);
    article.appendChild(price);
    article.appendChild(button);
    
    return article;
}