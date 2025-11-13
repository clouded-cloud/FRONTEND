// POS Cart functionality - Vanilla JS version
// Save this as src/components/Menu/POSCart.js

let cart = JSON.parse(localStorage.getItem('posCart')) || [];

const cartCount = document.querySelector('.cart-count');
const cartIcon = document.querySelector('.cart-icon');
const cartModal = document.getElementById('cart-modal');
const cartModalClose = document.getElementById('cart-modal-close');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const clearCartBtn = document.getElementById('clear-cart-btn');

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('posCart', JSON.stringify(cart));
}

// Function to update cart count
function updateCartCount() {
    if (!cartCount) return;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Function to show notifications (notistack alternative)
function showNotification(message, variant = 'info') {
    // Try notistack if available globally
    if (typeof enqueueSnackbar !== 'undefined') {
        enqueueSnackbar(message, { variant });
        return;
    }

    // Fallback notification
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 24px;
        border-radius: 4px;
        color: white;
        font-weight: 500;
        z-index: 9999;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        background-color: ${variant === 'success' ? '#10b981' : variant === 'error' ? '#ef4444' : '#3b82f6'};
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Function to update cart display
function updateCartDisplay() {
    if (!cartItemsContainer || !cartTotal || !checkoutBtn) return;

    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="text-center text-gray-500 py-8">
                <p>Your cart is empty</p>
                <p class="text-sm">Add items from the menu</p>
            </div>
        `;
        cartTotal.innerHTML = '<span class="font-bold text-lg">Total: 0 KSH</span>';
        checkoutBtn.disabled = true;
        if (clearCartBtn) clearCartBtn.disabled = true;
        return;
    }

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'bg-gray-50 rounded-lg p-3 mb-3';
        cartItem.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <div class="flex-1">
                    <h3 class="font-semibold text-gray-900">${item.name}</h3>
                    <p class="text-gray-600">${item.price} KSH each</p>
                </div>
                <button onclick="removeFromCart(${index})" class="text-red-500 hover:text-red-700 ml-2 text-xl leading-none">
                    ×
                </button>
            </div>
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                    <button onclick="updateQuantity(${index}, ${item.quantity - 1})" 
                            class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 text-sm font-bold">
                        -
                    </button>
                    <span class="font-medium">${item.quantity}</span>
                    <button onclick="updateQuantity(${index}, ${item.quantity + 1})" 
                            class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 text-sm font-bold">
                        +
                    </button>
                </div>
                <span class="font-bold">
                    ${itemTotal} KSH
                </span>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    cartTotal.innerHTML = `<span class="font-bold text-lg">Total: ${total} KSH</span>`;
    checkoutBtn.disabled = false;
    if (clearCartBtn) clearCartBtn.disabled = false;
}

// Function to add item to cart
function addToCart(productData) {
    const { name, price, category } = productData;
    const priceValue = typeof price === 'string' ? parseInt(price.replace(' KSH', '').trim()) : price;
    
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: Date.now(),
            name,
            price: priceValue,
            category: category || 'General',
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification('Item added to cart', 'success');
    
    // Animate cart icon
    if (cartIcon) {
        cartIcon.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartIcon.style.transform = 'scale(1)';
        }, 300);
    }
}

// Function to update quantity
function updateQuantity(index, newQuantity) {
    if (!cart[index]) return;
    
    if (newQuantity < 1) {
        removeFromCart(index);
        return;
    }
    
    cart[index].quantity = newQuantity;
    saveCart();
    updateCartCount();
    updateCartDisplay();
}

// Function to remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartCount();
    updateCartDisplay();
    showNotification('Item removed from cart', 'info');
}

// Function to clear cart
function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
    updateCartDisplay();
    showNotification('Cart cleared', 'info');
}

// Modal functions
function showCartModal() {
    if (cartModal) {
        cartModal.style.display = 'flex';
        updateCartDisplay();
    }
}

function hideCartModal() {
    if (cartModal) {
        cartModal.style.display = 'none';
    }
}

// Checkout function
async function handleCheckout() {
    if (!checkoutBtn || cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }

    const originalText = checkoutBtn.textContent;
    checkoutBtn.textContent = 'Processing...';
    checkoutBtn.disabled = true;

    try {
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value ||
                         document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1];

        const response = await fetch('http://localhost:8000/api/website-orders/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken || ''
            },
            body: JSON.stringify({
                items: cart.map(({id, ...item}) => item), // Remove internal ID
                customer_info: {
                    name: 'Website Customer',
                    source: 'HTML Website'
                }
            })
        });

        if (response.ok) {
            const result = await response.json();
            showNotification('Order placed successfully!', 'success');
            cart = [];
            saveCart();
            updateCartCount();
            updateCartDisplay();
            hideCartModal();
        } else {
            const error = await response.json();
            showNotification(`Error: ${error.message || 'Failed to place order'}`, 'error');
        }
    } catch (error) {
        console.error('Checkout error:', error);
        showNotification('Network error. Please try again.', 'error');
    } finally {
        checkoutBtn.textContent = originalText;
        checkoutBtn.disabled = false;
    }
}

// Initialize cart
function initCart() {
    updateCartCount();
    updateCartDisplay();
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    initCart();

    // Cart icon
    if (cartIcon) {
        cartIcon.addEventListener('click', showCartModal);
    }

    // Close modal
    if (cartModalClose) {
        cartModalClose.addEventListener('click', hideCartModal);
    }

    if (cartModal) {
        cartModal.addEventListener('click', function(e) {
            if (e.target === cartModal) hideCartModal();
        });
    }

    // Clear cart button
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }

    // Checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }

    // Add product card listeners
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            if (!productCard) return;

            const name = productCard.querySelector('.product-name')?.textContent;
            const price = productCard.querySelector('.product-price')?.textContent;
            const category = productCard.querySelector('.product-category')?.textContent || 'General';

            if (!name || !price) {
                console.error('Product card missing name or price');
                return;
            }

            addToCart({ name, price, category });

            // Button feedback
            const originalText = this.textContent;
            this.textContent = 'Added!';
            this.style.backgroundColor = '#1f2937';
            this.style.color = '#ffffff';

            setTimeout(() => {
                this.textContent = originalText;
                this.style.backgroundColor = '';
                this.style.color = '';
            }, 1500);
        });
    });
});

// Global functions for onclick handlers
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;