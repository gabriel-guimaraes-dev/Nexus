import { Item } from "../data/items.js";
import { renderUser, syncUserState } from "./auth.js";
import { updateCartCount } from "./cart.js";
import { inventoryService } from "../services/inventoryService.js";
import { showToast } from "../utils/ui.js";

// DOM manipulation filters
const filterSelect = document.querySelector('#filters');
const raritySelect = document.querySelector('#rarity');
const typeSelect = document.querySelector('#item-type');
let currentPage = 1;
const itemsPerPage = 3;
const slotNames = {
    head: 'Helmet',
    chest: 'Chest',
    rightWeapon: 'Weapon',
    leftWeapon: 'Shield',
    legs: 'Legs',
    arms: 'Arms'
}

// render inventory items and filters functions
export function initializeInventory() {
    updateCartCount();
    renderInventory();
    renderEquipment();
    

    if(filterSelect) filterSelect.addEventListener('change', applyInventoryFilters);
    if(raritySelect) raritySelect.addEventListener('change', applyInventoryFilters);
    if(typeSelect) typeSelect.addEventListener('change', applyInventoryFilters);

    const clearEquipmentBtn = document.querySelector('#clear-equipment-btn');

    if(clearEquipmentBtn) {
        clearEquipmentBtn.addEventListener('click', clearEquipment);
    }
}

// render inventory cards with equip button and quantity
function renderInventory(items = null) {
    const inventoryGrid = document.querySelector('.inventory-grid');
    

    if(!inventoryGrid) return;

    const inventory = items || JSON.parse(localStorage.getItem('inventory')) || [];

    inventoryGrid.innerHTML = '';

    if(inventory.length === 0) {
        inventoryGrid.innerHTML = `
            <div class="empty-inventory">
                <h3>Your inventory is empty</h3>
                <p>Go buy som Legendary gear!</p>
            </div>
        `;
        return;
    }

    // pagination and card render
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = inventory.slice(start, end);

    paginatedItems.forEach(entry => {
        const itemData = entry.item;
        const quantity = entry.quantity;

        const item = new Item(
            itemData.name,
            itemData.power,
            itemData.gold,
            itemData.image,
            itemData.type,
            itemData.rarity,
            itemData.specification
        );

        const card = item.getItem(() => {}, false);
        const quantityTag = document.createElement('span');

        quantityTag.textContent = `x${quantity}`;
        quantityTag.classList.add('inventory-quantity');

        const equipBtn = document.createElement('button');
        const sellBtn = document.createElement('button');

        sellBtn.textContent = 'Sell';
        sellBtn.classList.add('sell-inventory-btn');

        sellBtn.addEventListener('click', () => {
            sellItem(itemData);
        });

        equipBtn.textContent = 'Equip';
        equipBtn.classList.add('equip-btn');
        equipBtn.addEventListener('click', () => {
            equipItem(itemData);
        });

        card.classList.add('inventory-card');

        card.appendChild(quantityTag);
        card.appendChild(equipBtn);
        card.appendChild(sellBtn);

        inventoryGrid.appendChild(card);
    });

    renderInventoryPagination(inventory);
}

async function equipItem(item) {
    try {
        await inventoryService.equip(item.name);

        await syncUserState();
        renderInventory();
        renderEquipment();

        showToast(`${item.name} equipped`, 'success');

        window.location.reload();
    } catch(error) {
        console.error(error);
        showToast(error.message || 'Equip failed', 'error');
    }
}

function renderEquipment() {
    let equipment = JSON.parse(localStorage.getItem('equipment')) || {};

    if(typeof equipment === 'string'){
        try {
            equipment = JSON.parse(equipment);
        }catch {
            equipment = {};
        }
    }

    const allSlots = [
        'head',
        'chest',
        'rightWeapon',
        'leftWeapon',
        'legs',
        'arms'
    ];

    allSlots.forEach(slotName => {
        const slotElement = document.querySelector(`.slot-${slotName}`);

        if(!slotElement) return;

        const item = equipment[slotName];

        if(item) {
            slotElement.style.backgroundImage = `url('${item.image}')`;
            slotElement.style.backgroundSize = '90%';
            slotElement.style.backgroundRepeat = 'no-repeat';
            slotElement.style.backgroundPosition = 'center';
            slotElement.textContent = '';
        } else {
            slotElement.style.backgroundImage = 'none';
            slotElement.textContent = slotName;
        }
    });

    updateStats(equipment);
}

function updateStats(equipment) {
    let totalPower = 0;
    const statsContainer = document.querySelector('.character-stats');

    if(typeof equipment !== 'object' || equipment === null){
        equipment = {};
    }

    Object.values(equipment).forEach(item => {
        if(item) {
            totalPower += item.power;
        }
    });

    const powerElement = document.querySelector('#power');

    if(!powerElement) return;

    powerElement.textContent = totalPower;

    let equippedStatsHTML = `
        <h3 class="stats-title">Stats</h3>
        <p class="total-power">Total Power: ${totalPower}</p>
        <div class="equipment-stats-grid">
    `;

    Object.entries(equipment).forEach(([slot, item]) => {
        if(item) {
            equippedStatsHTML += `
                <div class="stat-item">
                    <span>${slotNames[slot]}</span>
                    <span>+${item.power}</span>
                </div>
            `;
        }
    });

    statsContainer.innerHTML = equippedStatsHTML;
}

// inventory filters
function applyInventoryFilters() {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const selectedFilter = filterSelect.value;
    const selectedRarity = raritySelect.value;
    const selectedType = typeSelect.value;
    
    const filteredInventory = inventory.filter(entry =>  {
        const item = entry.item;

        const matchesFilter = 
            selectedFilter === 'all' || item.type === selectedFilter;
        

        const matchesRarity =
            selectedRarity === 'all' || item.rarity === selectedRarity;

        
        const matchesType =
            selectedType === 'all' || item.specification === selectedType;

        return matchesFilter && matchesRarity && matchesType;
    });

    renderInventory(filteredInventory);
}

// pagination controls 
function renderInventoryPagination(items) {
    const paginationContainer = document.querySelector('.pagination');

    if (!paginationContainer) return;

    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(items.length / itemsPerPage);
    
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');

        button.textContent = i;
        button.classList.add('page-btn');

        if(i === currentPage) {
            button.classList.add('active-page');
        }

        button.addEventListener('click', () => {
            currentPage = i;
            renderInventory();
        });

        paginationContainer.appendChild(button);
    }
}

async function sellItem(itemData) {
    const user = JSON.parse(localStorage.getItem('nexusUser'));

    if(!user) return;

    try {
        const data = await inventoryService.sell(itemData.name);

        const updatedUser = {
            id: user.id,
            name: user.name,
            gold: data.gold
        };

        localStorage.setItem('nexusUser', JSON.stringify(updatedUser));
        localStorage.setItem('inventory', JSON.stringify(data.inventory || []));
        localStorage.setItem('equipment', JSON.stringify(data.equipment || {}));

        renderUser(updatedUser, document.querySelector('#user-area'), document.querySelector('#auth-modal'));

        await syncUserState();
        renderInventory();
        renderEquipment();

        showToast(`${itemData.name} sold`, 'success');

        window.location.reload();
    } catch(error) {
        console.error(error);
        showToast(error.message || 'Sell failed', 'error');
    }
}

async function clearEquipment() {
    localStorage.removeItem('equipment');
    renderEquipment();
    showToast('Equipment cleared', 'info');
}
