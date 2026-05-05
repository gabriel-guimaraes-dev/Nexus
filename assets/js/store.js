function main () {
    
    class Item {
        constructor (name, power, gold, image, type, rarity, specification) {
            this.name = name;
            this.power = power;
            this.gold = gold;
            this.image = image;
            this.type = type;
            this.rarity = rarity;
            this.specification = specification;
        }

        getItem () {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.style.backgroundImage = `url('${this.image}')`;

            card.innerHTML = `
                <h2 class="card-title">${this.name}</h2>
                <div class="card-stats">
                    <span class="stat-power">&#9876; ${this.power}</span>
                    <span class="stat-gold">&#x1F4B0; ${this.gold}G</span>
                </div>
                <button class="buy-btn">Add To Cart</button>
            `;
            return card;
        }
    }

    const itemList = [
        new Item ("freeze sword", 25, 65, "/assets/images/itens/swords/freeze_sword_default.png", "weapon", "common", "sword"),
        new Item ("rare freeze sword", 40, 100, "/assets/images/itens/swords/freeze_sword_rare.png", "weapon", "rare", "sword"),
        new Item ("legendary freeze sword", 65, 150, "/assets/images/itens/swords/freeze_sword_legendary.png", "weapon", "legendary", "sword"),
        new Item ("rare poison sword", 35, 85, "/assets/images/itens/swords/poison_sword_rare.png", "weapon", "rare", "sword"),
        new Item ("legendary poison sword", 60, 120, "/assets/images/itens/swords/poison_sword_legendary.png", "weapon", "legendary", "sword"),
        new Item ("thunder spear", 45, 132, "/assets/images/itens/spears/thunder_spear_default.png", "weapon", "common", "spear"),
        new Item ("rare thunder spear", 65, 160, "/assets/images/itens/spears/thunder_spear_rare.png", "weapon", "rare", "spear"),
        new Item ("legendary thunder spear", 45, 132, "/assets/images/itens/spears/thunder_spear_legendary.png", "weapon", "legendary", "spear"),
        new Item ("fire daggers", 25, 80, "/assets/images/itens/daggers/fire_dagger_default.png", "weapon", "common", "dagger"),
        new Item ("rare fire daggers", 35, 95, "/assets/images/itens/daggers/fire_dagger_rare.png", "weapon", "rare", "dagger"),
        new Item ("legendary fire daggers", 50, 100, "/assets/images/itens/daggers/fire_dagger_legendary.png", "weapon", "legendary", "dagger"),
        new Item ("poison bow", 35, 70, "/assets/images/itens/bows/poison_bow_default.png", "weapon", "common", "bow"),
        new Item ("rare poison bow", 40, 75, "/assets/images/itens/bows/poison_bow_rare.png", "weapon", "rare", "bow"),
        new Item ("legendary poison bow", 50, 100, "/assets/images/itens/bows/poison_bow_legendary.png", "weapon", "legendary", "bow"),
        new Item ("rare thunder bow", 40, 85, "/assets/images/itens/bows/thunder_bow_rare.png", "weapon", "rare", "bow"),
        new Item ("legendary thunder bow", 50, 110, "/assets/images/itens/bows/thunder_bow_legendary.png", "weapon", "legendary", "bow"),
        new Item ("shield", 50, 185, "/assets/images/itens/shield/shield_default.png", "weapon", "common", "shield"),
        new Item ("rare shield", 80, 350, "/assets/images/itens/shield/shield_rare.png", "weapon", "rare", "shield"),
        new Item ("legendary shield", 200, 1800, "/assets/images/itens/shield/shield_legendary.png", "weapon", "legendary", "shield"),
        new Item ("leggings", 50, 300, "/assets/images/itens/armor/legs/legs_default.png", "armor", "common", "legging"),
        new Item ("rare leggings", 55, 320, "/assets/images/itens/armor/legs/legs_rare.png", "armor", "rare", "legging"),
        new Item ("legendary leggings", 550, 750, "/assets/images/itens/armor/legs/legs_legendary.png", "armor", "legendary", "legging"),
        new Item ("helmet", 150, 250, "/assets/images/itens/armor/helmet/helmet_default.png", "armor", "common", "helmet"),
        new Item ("rare helmet", 200, 350, "/assets/images/itens/armor/helmet/helmet_rare.png", "armor", "rare", "helmet"),
        new Item ("legendary helmet", 400, 800, "/assets/images/itens/armor/helmet/helmet_legendary.png", "armor", "legendary", "helmet"),
        new Item ("chest", 180, 500, "/assets/images/itens/armor/chest/chest_default.png", "armor", "common", "chest"),
        new Item ("rare chest", 250, 700, "/assets/images/itens/armor/chest/chest_rare.png", "armor", "rare", "chest"),
        new Item ("legendary chest", 670, 1500, "/assets/images/itens/armor/chest/chest_legendary.png", "armor", "legendary", "chest"),
        new Item ("arms", 100, 200, "/assets/images/itens/armor/arms/arms_default.png", "armor", "common", "arms"),
        new Item ("rare arms", 150, 250, "/assets/images/itens/armor/arms/arms_rare.png", "armor", "rare", "arms"),
        new Item ("legendary arms", 350, 500, "/assets/images/itens/armor/arms/arms_legendary.png", "armor", "legendary", "arms"),
    ];

    const container = document.querySelector('.store-grid');

    itemList.forEach(item => {
        container.appendChild(item.getItem());
    });


}
main();
