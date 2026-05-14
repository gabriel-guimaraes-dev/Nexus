import { openModal, closeModal, setupModalOverlay, setupEscClose, showToast } from "../utils/ui.js";
import { authService } from '../services/authService.js';
import { initializeInventory } from "./inventory.js";


const getUserElements = () => ({
    userArea: document.querySelector('#user-area'),
    modal: document.querySelector('#auth-modal')
});

// sync user state
export async function syncUserState() {
    const token = localStorage.getItem('nexusToken');
    if (!token) return null;

    try {
        const data = await authService.getUserState();

        if (!data) return null;


        const formattedUser = {
            id: data.id,
            name: data.username,
            gold: data.gold
        };

        localStorage.setItem('nexusUser', JSON.stringify({
            id: data.id,
            name: data.username,
            gold: data.gold
        }));

        localStorage.setItem('nexusUser', JSON.stringify(formattedUser));
        localStorage.setItem('inventory', JSON.stringify(data.inventory || []));
        localStorage.setItem('equipment', JSON.stringify(data.equipment || {}));

        const {userArea, modal} = getUserElements();
        if(userArea) renderUser(formattedUser, userArea, modal);

        return data;
    } catch (err) {
        console.error('syncUserState error:', err);
        return null;
    }
}

// initialize auth system
export function initializeAuth() {
    const {userArea, modal} = getUserElements();
    const loginBtn = document.querySelector('.login-btn');
    const submitBtn = document.querySelector('#auth-submit');
    const usernameInput = document.querySelector('#username-input');
    const passwordInput = document.querySelector('#password-input');
    const closeBtn = document.querySelector('#close-modal');

    const savedUser = JSON.parse(localStorage.getItem('nexusUser'));

    if (!modal || !submitBtn || !usernameInput || !passwordInput || !userArea) return;

    // restore session
    if (savedUser) {
        renderUser(savedUser, userArea, modal);
    }

    if(closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeModal(modal, usernameInput);
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', () => openModal(modal));
    }

    setupModalOverlay(modal, usernameInput);
    setupEscClose(modal, usernameInput);

    submitBtn.addEventListener('click', async () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            showToast('Fill all fields first', 'error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Loading...';

        try {
            let user;

            // try login
            try {
                user = await authService.login({ username, password });
            } catch (err) {
                if(err.message === 'User not found'){
                    // if failed try to register
                    user = await authService.register({ username, password });
                    showToast('Account created Successfully!', 'success');
                } else{
                    throw err;
                }
                
            }

            localStorage.setItem('nexusToken', user.token);

            const formattedUser = {
                id: user.id,
                name: user.username,
                gold: user.gold
            };

            localStorage.setItem('nexusUser', JSON.stringify(formattedUser));
            localStorage.setItem('inventory', JSON.stringify(user.inventory || []));
            localStorage.setItem('equipment', JSON.stringify(user.equipment || {}));

            renderUser(formattedUser, userArea, modal);
            closeModal(modal, usernameInput);

            showToast('Login successful!', 'success');        

            
            initializeInventory();

        } catch (error) {
            console.error(error);
            showToast(error.message || 'Authentication failed', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Continue';
        }
    });
}

// logout
function logoutUser(userArea, modal) {
    localStorage.removeItem('nexusUser');
    localStorage.removeItem('nexusToken');
    localStorage.removeItem('inventory');
    localStorage.removeItem('equipment');
    localStorage.removeItem('cart');

    showToast('Logged out successfully', 'info');
    
    setTimeout(() =>{
        window.location.reload();
        return;
    }, 500);
}

// render user
export function renderUser(user, userArea, modal) {
    userArea.innerHTML = `
        <span>${user.name}</span>
        <span>💰 ${user.gold}G</span>
        <button id="logout-btn">Logout</button>
    `;

    const logoutBtn = document.querySelector('#logout-btn');

    if(logoutBtn) {
        logoutBtn.addEventListener('click', () => logoutUser(userArea, modal));
    }
}
