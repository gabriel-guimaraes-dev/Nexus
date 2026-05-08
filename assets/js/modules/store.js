import { addToCart } from './cart.js';
import { itemList } from '../data/items.js';

// DOM manipulation variables
const container = document.querySelector('.store-grid');
const filterSelect = document.querySelector('#filters');
const raritySelect = document.querySelector('#rarity');
const typeSelect = document.querySelector('#item-type');
let filteredItems = itemList;
let currentPage = 1;
const itemsPerPage = 6;

// render paginated store items
function renderItems (items) {
    container.innerHTML = '';

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = items.slice(start, end);

    paginatedItems.forEach(item => {
        container.appendChild(item.getItem(addToCart));
    });
    renderPagination(items);        
}

// filters control
function applyFilters () {
    const selectedFilter = filterSelect.value;
    const selectedRarity = raritySelect.value;
    const selectedType = typeSelect.value;

    filteredItems = itemList.filter(item => {
        const matchesFilter = 
            selectedFilter === 'all' || item.type === selectedFilter;

        const matchesRarity = 
            selectedRarity === 'all' || item.rarity === selectedRarity;
        
        const matchesType = 
            selectedType === 'all' || item.specification === selectedType;

        return matchesFilter && matchesRarity && matchesType;
    });
    currentPage = 1;
    renderItems(filteredItems);
}

// render pagination buttons
function renderPagination(items) {
    const paginationContainer = document.querySelector('.pagination');

    if(!paginationContainer) return;
    
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
            renderItems(filteredItems);
        });

        paginationContainer.appendChild(button);
    }
}

export function initializeStore() {
    if(!container) return;

    if(filterSelect) filterSelect.addEventListener('change', applyFilters);
    if(raritySelect) raritySelect.addEventListener('change', applyFilters);
    if(typeSelect) typeSelect.addEventListener('change', applyFilters);

    renderItems(itemList);
}
