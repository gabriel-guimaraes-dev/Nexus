import { showToast } from '../utils/ui.js';
import { renderUser } from './auth.js';
import { setupEscClose, setupModalOverlay } from '../utils/ui.js';

// handle DOM variables
const cartModal = document.querySelector('#cart-modal');
const closeCart = document.querySelector('#close-cart');
const cartIcon = document.querySelector('.cart');
const buyCartBtn = document.querySelector('#buy-cart-btn');
const clearCartBtn = document.querySelector('#clear-cart-btn');

setupModalOverlay(cartModal);
setupEscClose(cartModal);

// clear and buy events
if(clearCartBtn) clearCartBtn.addEventListener('click', clearCart);

if (buyCartBtn) buyCartBtn.addEventListener('click', buyCart);

if(closeCart) {
    closeCart.addEventListener('click', () => {
        cartModal.classList.add('hidden');
    });
}

if(cartIcon) {
    cartIcon.addEventListener('click', openCart);
}

function openCart() {
    renderCart();
    cartModal.classList.remove('hidden');
}

// add the item to the cart and check if it already exist and change the quantity
export function addToCart(item) {
    let cart = getCart();

    const existingItem = cart.find(cartItem =>
        cartItem.item.name === item.name
    );

    if(existingItem){
        existingItem.quantity++;
    } else {
        cart.push({
            item,
            quantity: 1
        });
    }

    saveCart(cart);
    updateCartCount();

    localStorage.setItem('cart', JSON.stringify(cart));

    if(cartModal && !cartModal.classList.contains('hidden')) {
        renderCart();
    }

    showToast(`${item.name} added to cart`, 'success');
}

// cart render to add items, increase, decrease and remove from the cart
export function renderCart() {
    const cartItemsContainer = document.querySelector('#cart-items');
    const totalContainer = document.querySelector('#cart-total');
    const cart = getCart();

    if(!cartItemsContainer || !totalContainer) return;

    if(cart.length === 0){
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is Empty</h3>
                <p>Add some Legendary loot.</p>
            </div>
        `;

        totalContainer.textContent = 'Total: 0G';
        return;
    }

    cartItemsContainer.innerHTML = '';

    let total = 0;

    cart.forEach(cartEntry => {
        const item = cartEntry.item;
        const quantity = cartEntry.quantity;
        
        total += item.gold * quantity;

        const itemDiv = document.createElement('div');

        itemDiv.classList.add('cart-item');
        
        itemDiv.innerHTML = `
            <p>${item.name}</p>
            <p>${item.gold}G x ${quantity}</p>

            <div class="cart-controls">
                <button class="decrease-btn">-</button>
                <span>${quantity}</span>
                <button class="increase-btn">+</button>
                <button class="remove-btn">Remove</button>
            </div>
        `;

        itemDiv.querySelector('.increase-btn').addEventListener('click', () => increaseQuantity(item.name));
        
        itemDiv.querySelector('.decrease-btn').addEventListener('click', () => decreaseQuantity(item.name));

        itemDiv.querySelector('.remove-btn').addEventListener('click', () => removeItem(item.name));

        cartItemsContainer.appendChild(itemDiv);
    });

    totalContainer.textContent = `Total: ${total}G`;
}

// increase the quantity in the cart for each item
function increaseQuantity (itemName) {
    let cart = getCart();

    const cartItem = cart.find(item => item.item.name === itemName);

    if(!cartItem) return;

    cartItem.quantity++;

    saveCart(cart);

    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

// decrease the quantity in the cart for each item
function decreaseQuantity(itemName){
    let cart = getCart();

    const cartItem = cart.find(item => item.item.name === itemName);

    if(!cartItem) return;

    cartItem.quantity--;

    if(cartItem.quantity <= 0) {
        cart = cart.filter(item => item.item.name !== itemName);
    }

    saveCart(cart);

    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

// remove an item from the cart
function removeItem(itemName) {
    cart = cart.filter(item => item.item.name !== itemName);

    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();

    showToast('Item removed from cart', 'info');
}

// handle cart checkout logic
function buyCart() {
    const user = JSON.parse(localStorage.getItem('nexusUser'));
    const userArea = document.querySelector('#user-area');
    const modal = document.querySelector('#auth-modal');
    let cart = getCart();

    if(cart.length === 0){
        showToast('Cart is empty', 'error');
        return;
    }

    if (!user) {
        showToast('You need to login first', 'error');
        return;
    }

    const total = cart.reduce((sum, cartItem) => {
        return sum + (cartItem.item.gold * cartItem.quantity);
    }, 0);

    if(user.gold < total) {
        showToast('Not enough gold', 'error');
        return;
    }

    user.gold -= total;

    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];

    cart.forEach(cartEntry => {
        const existingItem = inventory.find(inventoryItem => inventoryItem.item.name === cartEntry.item.name);

        if(existingItem) {
            existingItem.quantity += cartEntry.quantity;
        }else {
            inventory.push({...cartEntry});
        }
    });

    localStorage.setItem('inventory', JSON.stringify(inventory));
    localStorage.setItem('nexusUser', JSON.stringify(user));

    cart = [];
    saveCart([]);

    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartCount();
    renderUser(user, userArea, modal);
    renderCart();

    if(cartModal) {
        cartModal.classList.add('hidden');
    }

    showToast('Purchase successful!', 'success');
    
    window.location.reload();
}

// update cart badge counter
export function updateCartCount() {
    const cartCount = document.querySelector('#cart-count');

    if(!cartCount) return;

    const cart = getCart();

    const totalItems = cart.reduce((sum, cartItem) => {
        return sum + cartItem.quantity;
    }, 0);

    cartCount.textContent = totalItems;
}

// remove all items from the cart
function clearCart() {
    let cart = getCart();

    cart = [];

    localStorage.setItem('cart', JSON.stringify(cart));

    renderCart();
    updateCartCount();
    
    if(cartModal) {
        cartModal.classList.add('hidden');
    }

    showToast('Cart Cleared', 'info');
}

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(updatedCart) {
    localStorage.setItem('cart', JSON.stringify(updatedCart));
}

updateCartCount();
