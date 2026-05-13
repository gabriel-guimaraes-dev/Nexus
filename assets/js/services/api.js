const API_URL = 'https://nexus-p33c.onrender.com';

function getToken() {
    return localStorage.getItem('nexusToken');
}

async function request(endpoint, options = {}) {
    try {
        const token = getToken();

        const config = {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {}),
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            ...(options.body ? { body: options.body } : {})
        };

        const response = await fetch(`${API_URL}${endpoint}`, config);

        // tenta parsear JSON com segurança
        const data = await response.json().catch(() => null);

        if (!response.ok) {
            const message = data?.error || 'Request failed';
            throw new Error(message);
        }

        return data;
    } catch (error) {
        console.error('[API ERROR]', error.message);
        throw error;
    }
}

export default request;