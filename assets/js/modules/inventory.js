import { Item } from "../data/items.js";
import { updateCartCount } from "./cart.js";

export function initializeInventory() {
    updateCartCount();
    renderInventory();
    

    if(filterSelect) filterSelect.addEventListener('change', applyInventoryFilters);
    if(raritySelect) raritySelect.addEventListener('change', applyInventoryFilters);
    if(typeSelect) typeSelect.addEventListener('change', applyInventoryFilters);
}

const filterSelect = document.querySelector('#filters');
const raritySelect = document.querySelector('#rarity');
const typeSelect = document.querySelector('#item-type');

let currentPage = 1;
const itemsPerPage = 3;

function renderInventory(items = null) {
    const inventoryGrid = document.querySelector('.inventory-grid');
    

    if(!inventoryGrid) return;

    const inventory = items || JSON.parse(localStorage.getItem('inventory')) || [];

    inventoryGrid.innerHTML = '';

    const start = (currentPage - 1) *itemsPerPage;
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

        equipBtn.textContent = 'Equip';
        equipBtn.classList.add('equip-btn');

        card.classList.add('inventory-card');

        card.appendChild(quantityTag);
        card.appendChild(equipBtn);

        inventoryGrid.appendChild(card);
    });

    renderInventoryPagination(inventory);
}

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
