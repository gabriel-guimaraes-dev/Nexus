// Page initialization
import { initializeAuth } from './modules/auth.js';
import { initializeStore } from './modules/store.js';
import { initializeInventory } from './modules/inventory.js';

// initialize user authentication
initializeAuth();

const currentPage = window.location.pathname;

// detect current page and load corresponding features
if (currentPage.includes('store.html')) {
    initializeStore();
} else if (currentPage.includes('inventory.html')) {
    initializeInventory();
}
