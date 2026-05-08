import { openModal, closeModal, setupModalOverlay, setupEscClose } from "../utils/ui.js";

// initialize authentication system
export function initializeAuth() {
    // authentication DOM elements
    const modal = document.querySelector('#auth-modal');
    const loginBtn = document.querySelector('.login-btn');
    const submitBtn = document.querySelector('#auth-submit');
    const usernameInput = document.querySelector('#username-input');
    const userArea = document.querySelector('#user-area');
    const savedUser = JSON.parse(localStorage.getItem('nexusUser'));

    if(!modal || !submitBtn || !usernameInput || !userArea) return;

    // restore saved user session
    if(savedUser) {
        renderUser(savedUser, userArea, modal);
    }

    if(loginBtn) {
        loginBtn.addEventListener('click', () =>{
            openModal(modal);
        });
    }

    setupModalOverlay(modal, usernameInput);
    setupEscClose(modal, usernameInput);
    
    // create new user session with starter gold
    if(submitBtn) {
        submitBtn.addEventListener('click', () => {
            const username = usernameInput.value.trim();

            if (!username) return;

            const user = {
                name: username, 
                gold: 5000
            };

            localStorage.setItem('nexusUser', JSON.stringify(user));

            renderUser(user, userArea, modal);
            closeModal(modal, usernameInput);
        });  
    }
}

// handle user logout
function logoutUser(userArea, modal) {
    localStorage.removeItem('nexusUser');
    localStorage.removeItem('inventory');
    localStorage.removeItem('cart');
    
    window.location.reload();

    userArea.innerHTML = `
        <button class="login-btn">Login / Register</button>
    `;

    const newLoginBtn = document.querySelector('.login-btn');

    newLoginBtn.addEventListener('click', () => {
        openModal(modal);
    });
}

// render logged user data
export function renderUser(user, userArea, modal) {
    userArea.innerHTML = `
        <span>${user.name}</span>
        <span>&#x1F4B0; ${user.gold}G</span>
        <button id="logout-btn">Logout</button>
    `;
    
    const logoutBtn = document.querySelector('#logout-btn');

    logoutBtn.addEventListener('click', () => {
        logoutUser(userArea, modal);
    });
}
