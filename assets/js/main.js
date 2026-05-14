// Page initialization
import { initializeAuth } from './modules/auth.js';
import { initializeCart } from './modules/cart.js';
import { initializeStore } from './modules/store.js';
import { initializeInventory } from './modules/inventory.js';

document.addEventListener('DOMContentLoaded', () => {
    // initialize user authentication
    initializeAuth();

    initializeCart();

    const path = window.location.pathname.toLowerCase();

    if(path.includes('store')){
        initializeStore();
    } else if(path.includes('inventory')) {
        initializeInventory();
    }
});




