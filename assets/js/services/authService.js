import request from './api.js';

export const authService = {
    login: (data) => request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    register: (data) => request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    getUserState: () => request('/auth/user/state')
};
