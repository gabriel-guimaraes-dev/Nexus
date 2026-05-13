import request from "./api.js";

export const storeService = {
    buy: (cart) => 
        request('/store/buy', {
            method: 'POST',
            body: JSON.stringify({cart})
        })
};
