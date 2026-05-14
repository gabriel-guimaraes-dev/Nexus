import { renderUser, syncUserState } from './auth.js';
import { setupEscClose, setupModalOverlay, showToast} from '../utils/ui.js';
import {renderInventory, renderEquipment} from './inventory.js';
import { inventoryService } from "../services/inventoryService.js";
import { authService } from '../services/authService.js';
import {storeService} from '../services/storeService.js';

// handle DOM variables
const cartModal = document.querySelector('#cart-modal');
const closeCart = document.querySelector('#close-cart');
const cartIcon = document.querySelector('.cart');
const buyCartBtn = document.querySelector('#buy-cart-btn');
const clearCartBtn = document.querySelector('#clear-cart-btn');
let isBuying = false;

export function initializeCart() {
    const icon = document.querySelector('.cart');
    const modal = document.querySelector('#cart-modal');
    const btnBuy = document.querySelector('#buy-cart-btn');
    const btnClose = document.querySelector('#close-cart');
    const btnClear = document.querySelector('#clear-cart-btn');

    if (icon) {
        icon.onclick = () => {
            openCart();
        };
    }

    if (btnClose) {
        btnClose.onclick = () => modal.classList.add('hidden');
    }

    if (btnBuy) {
        btnBuy.onclick = async () => { 
            await buyCart(); 
        };
    }

    if (btnClear) {
        btnClear.onclick = clearCart;
    }
    
    if (modal) {
        setupModalOverlay(modal);
        setupEscClose(modal);
    }
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
            <div class="cart-item-info">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">

                <div class="cart-item-details">
                    <p>${item.name}</p>
                    <p>${item.gold}G x ${quantity}</p>
                </div>
            </div>
            
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
    renderCart();
    updateCartCount();
}

// remove an item from the cart
function removeItem(itemName) {
    let cart = getCart();

    cart = cart.filter(item => item.item.name !== itemName);

    saveCart(cart);
    renderCart();
    updateCartCount();

    showToast('Item removed from cart', 'info');
}

async function handleBuyClick() {
    await buyCart();
}

// handle cart checkout logic
async function buyCart() {
    if(isBuying) return; 

    let cart = getCart();

    if(cart.length === 0){
        showToast('Cart is empty', 'error');
        return;
    }

    isBuying = true;
    buyCartBtn.disabled = true;
    buyCartBtn.textContent = 'Processing...';

    const user = JSON.parse(localStorage.getItem('nexusUser'));
    const userArea = document.querySelector('#user-area');
    const modal = document.querySelector('#auth-modal');

    if (!user) {
        showToast('You need to login first', 'error');
        return;
    }

    try {
        const data = await storeService.buy(cart);

        localStorage.setItem('cart', JSON.stringify([]));

        const freshData = await syncUserState();

        if(freshData) {
            renderUser({
                id: freshData.id,
                name: freshData.username,
                gold: freshData.gold
            }, userArea, modal);

            renderInventory(freshData.inventory);
            renderEquipment(freshData.equipment);
        }

        updateCartCount();
        renderCart();

        if(cartModal) cartModal.classList.add('hidden');
        showToast('Purchase successful!', 'success');
    }  catch(error) {
        console.error(error);
        showToast(error.message || 'Purchase failed', 'error');
    } finally {
        isBuying = false;
        buyCartBtn.disabled = false;
        buyCartBtn.textContent = 'Buy';
    }
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
    saveCart([]);
    renderCart();
    updateCartCount();

    if(cartModal) cartModal.classList.add('hidden');
    
    showToast('Cart Cleared', 'info');
}

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(updatedCart) {
    localStorage.setItem('cart', JSON.stringify(updatedCart));
}

updateCartCount();
