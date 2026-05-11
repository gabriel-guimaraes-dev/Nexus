// item blueprint used to create store and inventory cards
export class Item {
    constructor (name, power, gold, image, type, rarity, specification) {
        this.name = name;
        this.power = power;
        this.gold = gold;
        this.image = image;
        this.type = type;
        this.rarity = rarity;
        this.specification = specification;
    }

    
    // generate item card element
    getItem (addToCartCallback, showBuyButton = true) {
        const card = document.createElement('div');
        
        card.className = `item-card ${this.specification} ${this.rarity}`;
        card.style.backgroundImage = `url('${this.image}')`;

        card.innerHTML = `
            <h2 class="card-title">${this.name}</h2>
            <div class="card-stats">
                <span class="stat-power">&#9876; ${this.power}</span>
                <span class="stat-gold">&#x1F4B0; ${this.gold}G</span>
            </div>
        `;

        if(showBuyButton){
            const buyBtn = document.createElement('button');

            buyBtn.classList.add('buy-btn');
            buyBtn.textContent = 'Add to Cart';

            buyBtn.addEventListener('click', () => {
                addToCartCallback(this);
            });

            card.appendChild(buyBtn);
        }

        return card;
    }
}

// available items
export const itemList = [
    new Item ("Ice Sword", 25, 65, "/assets/images/itens/swords/freeze_sword_default.png", "weapons", "common", "sword"),
    new Item ("Rare Ice Sword", 40, 100, "/assets/images/itens/swords/freeze_sword_rare.png", "weapons", "rare", "sword"),
    new Item ("Legendary Ice Sword", 65, 150, "/assets/images/itens/swords/freeze_sword_legendary.png", "weapons", "legendary", "sword"),
    new Item ("Rare Poison Sword", 35, 85, "/assets/images/itens/swords/poison_sword_rare.png", "weapons", "rare", "sword"),
    new Item ("Legendary Poison Sword", 60, 120, "/assets/images/itens/swords/poison_sword_legendary.png", "weapons", "legendary", "sword"),
    new Item ("Thunder Spear", 45, 132, "/assets/images/itens/spears/thunder_spear_default.png", "weapons", "common", "spear"),
    new Item ("Rare Thunder Spear", 65, 160, "/assets/images/itens/spears/thunder_spear_rare.png", "weapons", "rare", "spear"),
    new Item ("Legendary Thunder Spear", 45, 132, "/assets/images/itens/spears/thunder_spear_legendary.png", "weapons", "legendary", "spear"),
    new Item ("Fire Daggers", 25, 80, "/assets/images/itens/daggers/fire_dagger_default.png", "weapons", "common", "dagger"),
    new Item ("Rare Fire Daggers", 35, 95, "/assets/images/itens/daggers/fire_dagger_rare.png", "weapons", "rare", "dagger"),
    new Item ("Legendary Fire Daggers", 50, 100, "/assets/images/itens/daggers/fire_dagger_legendary.png", "weapons", "legendary", "dagger"),
    new Item ("Poison Bow", 35, 70, "/assets/images/itens/bows/poison_bow_default.png", "weapons", "common", "bow"),
    new Item ("Rare Poison Bow", 40, 75, "/assets/images/itens/bows/poison_bow_rare.png", "weapons", "rare", "bow"),
    new Item ("Legendary Poison Bow", 50, 100, "/assets/images/itens/bows/poison_bow_legendary.png", "weapons", "legendary", "bow"),
    new Item ("Rare Thunder Bow", 40, 85, "/assets/images/itens/bows/thunder_bow_rare.png", "weapons", "rare", "bow"),
    new Item ("Legendary Thunder Bow", 50, 110, "/assets/images/itens/bows/thunder_bow_legendary.png", "weapons", "legendary", "bow"),
    new Item ("Shield", 50, 185, "/assets/images/itens/shield/shield_default.png", "armor", "common", "shield"),
    new Item ("Rare Shield", 80, 350, "/assets/images/itens/shield/shield_rare.png", "armor", "rare", "shield"),
    new Item ("Legendary Shield", 200, 1800, "/assets/images/itens/shield/shield_legendary.png", "armor", "legendary", "shield"),
    new Item ("Leggins", 50, 300, "/assets/images/itens/armor/legs/legs_default.png", "armor", "common", "leggings"),
    new Item ("Rare Leggins", 55, 320, "/assets/images/itens/armor/legs/legs_rare.png", "armor", "rare", "leggings"),
    new Item ("Legendary Leggins", 550, 750, "/assets/images/itens/armor/legs/legs_legendary.png", "armor", "legendary", "leggings"),
    new Item ("Helmet", 150, 250, "/assets/images/itens/armor/helmet/helmet_default.png", "armor", "common", "helmet"),
    new Item ("Rare Helmet", 200, 350, "/assets/images/itens/armor/helmet/helmet_rare.png", "armor", "rare", "helmet"),
    new Item ("Legendary Helmet", 400, 800, "/assets/images/itens/armor/helmet/helmet_legendary.png", "armor", "legendary", "helmet"),
    new Item ("Chest", 180, 500, "/assets/images/itens/armor/chest/chest_default.png", "armor", "common", "chest"),
    new Item ("Rare Chest", 250, 700, "/assets/images/itens/armor/chest/chest_rare.png", "armor", "rare", "chest"),
    new Item ("Legendary Chest", 670, 1500, "/assets/images/itens/armor/chest/chest_legendary.png", "armor", "legendary", "chest"),
    new Item ("Arms", 100, 200, "/assets/images/itens/armor/arms/arms_default.png", "armor", "common", "arms"),
    new Item ("Rare Arms", 150, 250, "/assets/images/itens/armor/arms/arms_rare.png", "armor", "rare", "arms"),
    new Item ("Legendary Arms", 350, 500, "/assets/images/itens/armor/arms/arms_legendary.png", "armor", "legendary", "arms"),
];
