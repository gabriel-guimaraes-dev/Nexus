import request from "./api.js";

export const inventoryService = {
    equip: (itemName) => 
        request('/inventory/equip', {
            method: 'POST',
            body: JSON.stringify({itemName})
        })
    ,

        sell: (itemName) => 
            request('/inventory/sell', {
                method: 'POST', 
                body: JSON.stringify({itemName})
            })
        
};
