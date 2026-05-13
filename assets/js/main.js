// Page initialization
import { initializeAuth } from './modules/auth.js';
import { initializeStore } from './modules/store.js';
import { initializeInventory } from './modules/inventory.js';

// initialize user authentication
initializeAuth();

const getPath = () => {
    try{
        return window.location.pathname || '';
    }catch (e) {
        return '';
    }
};

const path = getPath().toLowerCase();

if(path.includes('store')){
    initializeStore();
} else if(path.includes('inventory')) {
    initializeInventory();
}
