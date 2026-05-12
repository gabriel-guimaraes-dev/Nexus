import { openModal, closeModal, setupModalOverlay, setupEscClose, showToast } from "../utils/ui.js";

const API_URL = 'http://localhost:3000/auth';

export async function saveUserProgress() {
    const user = JSON.parse(localStorage.getItem('nexusUser'));
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const equipment = JSON.parse(localStorage.getItem('equipment')) || {};

    if(!user || !user.id) {
        console.log('No valid user found');
        return;
    }

    console.log({
        id: user.id,
        gold: user.gold,
        inventory,
        equipment
    });

    try {
        await fetch(`${API_URL}/user/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: user.id,
                gold: user.gold,
                inventory,
                equipment
            })
        });
        console.log({
            id: user.id,
            gold: user.gold,
            inventory,
            equipment
        });
        showToast('Progress saved!', 'success');
    } catch (error) {
        console.error('Save failed:', error);
        showToast('Save failed', 'error');
    }
    
}

// initialize authentication system
export function initializeAuth() {
    // authentication DOM elements
    const modal = document.querySelector('#auth-modal');
    const loginBtn = document.querySelector('.login-btn');
    const submitBtn = document.querySelector('#auth-submit');
    const usernameInput = document.querySelector('#username-input');
    const passwordInput = document.querySelector('#password-input');
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
    submitBtn.addEventListener('click', async () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if(!username || !password) return;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Loading...';

        try {
            let response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, password})
            });

            if(!response.ok) {
                const errorData = await response.json();

                if(errorData.error === 'User not Found'){
                    response = await fetch(`${API_URL}/register`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({username, password})
                    });
                } else {
                    alert(errorData.error);
                    return;
                }
                
            }

            const user = await response.json();

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
            window.location.reload();
        } catch (error) {
            console.error(error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Continue';
        }
    });
}

// handle user logout
function logoutUser(userArea, modal) {
    localStorage.removeItem('nexusUser');
    localStorage.removeItem('inventory');
    localStorage.removeItem('equipment');
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
