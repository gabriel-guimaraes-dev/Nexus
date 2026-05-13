import { Item } from "../data/items.js";
import { renderUser, syncUserState } from "./auth.js";
import { updateCartCount } from "./cart.js";

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

function getSlotByItem(item) {
    const slotMap = {
        helmet: 'head',
        chest: 'chest',
        leggings: 'legs',
        shield: 'leftWeapon',
        sword: 'rightWeapon',
        spear: 'rightWeapon',
        bow: 'rightWeapon',
        dagger: 'rightWeapon',
        arms: 'arms'
    };

    return slotMap[item.specification];
}

async function equipItem(item) {
    const token = localStorage.getItem('nexusToken');

    await fetch('http://localhost:3000/inventory/equip', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({itemName: item.name})
    });

    await syncUserState();
    renderInventory();
    renderEquipment();

    window.location.reload();
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

    const poweerElement = document.querySelector('#power');

    if(!poweerElement) return;

    poweerElement.textContent = totalPower;

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

function checkFullSetBonus(equipment) {
    const equippedItems = Object.values(equipment).filter(Boolean);

    if(equippedItems.length< 6) return null;

    const allRare = equippedItems.every(item => item.rarity ==='rare');
    const allLegendary = equippedItems.every(item => item.rarity === 'legendary');

    if(allLegendary) return 'legendary';
    if(allRare) return 'rare';

    return null;
}

async function sellItem(itemData) {
    let user = JSON.parse(localStorage.getItem('nexusUser'));

    if(!user) return;

    try {
        const token = localStorage.getItem('nexusToken');

        const response = await fetch('http://localhost:3000/inventory/sell', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                itemName: itemData.name
            })
        });

        const data = await response.json();

        if(!response.ok) {
            alert(data.error);
            return;
        }
        
        const updatedUser = {
            id: user.id,
            name: user.name,
            gold: data.gold
        };

        localStorage.setItem('nexusUser', JSON.stringify(updatedUser));
        localStorage.setItem('inventory', JSON.stringify(data.inventory));
        localStorage.setItem('equipment', JSON.stringify(data.equipment));

        await syncUserState();

        window.location.reload();
    } catch(error) {
        console.error(error);
    }
}

async function clearEquipment() {
    localStorage.removeItem('equipment');
    renderEquipment();
}

function getEquipmentImage(item) {
    const imageMap = {
        //helmet
        "Helmet": "/assets/images/equipped/helmet/rare-helmet.png",
        "Rare Helmet": "/assets/images/equipped/helmet/rare-helmet.png",
        "Legendary Helmet": "/assets/images/equipped/helmet/legendary-helmet.png",

        // chest
        "Chest": "/assets/images/equipped/chest/default-chest.png",
        "Rare Chest": "/assets/images/equipped/chest/default-chest.png",
        "Legendary Chest": "/assets/images/equipped/chest/default-chest.png",

        //arms
        "Arms": "/assets/images/equipped/arms/rare-arms.png",
        "Rare Arms": "/assets/images/equipped/arms/rare-arms.png",
        "Legendary Arms": "/assets/images/equipped/arms/rare-arms.png",

        //legs
        "Leggins": "/assets/images/equipped/legs/default-legs.png",
        "Rare Leggins": "/assets/images/equipped/legs/default-legs.png",
        "Legendary Leggins": "/assets/images/equipped/legs/default-legs.png",

        //shield
        "Shield": "/assets/images/equipped/shield/rare-shield.png",
        "Rare Shield": "/assets/images/equipped/shield/rare-shield.png",
        "Legendary Shield": "/assets/images/equipped/shield/legendary-shield.png",

        //bow
        "Rare Thunder Bow": "/assets/images/equipped/bow/default-frozen-bow.png",
        "Legendary Thunder Bow": "/assets/images/equipped/bow/default-frozen-bow.png",
        "Poison Bow": "/assets/images/equipped/bow/default-poison-bow.png",
        "Rare Poison Bow": "/assets/images/equipped/bow/default-poison-bow.png",
        "Legendary Poison Bow": "/assets/images/equipped/bow/default-poison-bow.png",

        //dagger
        "Fire Daggers": "/assets/images/equipped/dagger/default-dagger.png",
        "Rare Fire Daggers": "/assets/images/equipped/dagger/default-dagger.png",
        "Legendary Fire Daggers": "/assets/images/equipped/dagger/default-dagger.png",

        //spear
        "Thunder Spear": "/assets/images/equipped/spear/default-spear.png",   
        "Rare Thunder Spear": "/assets/images/equipped/spear/default-spear.png", 
        "Legendary Thunder Spear": "/assets/images/equipped/spear/default-spear.png", 

        //sword
        "Ice Sword": "/assets/images/equipped/sword/default-frozen-sword.png",
        "Rare Ice Sword": "/assets/images/equipped/sword/default-frozen-sword.png",
        "Legendary Ice Sword": "/assets/images/equipped/sword/default-frozen-sword.png",
        "Rare Poison Sword": "/assets/images/equipped/sword/default-poison-sword.png",
        "Legendary Poison Sword": "/assets/images/equipped/sword/default-poison-sword.png"

    };

    return imageMap[item.name] || null;
}
