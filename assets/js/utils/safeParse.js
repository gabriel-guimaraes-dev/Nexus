export function safeParse(data, fallback) {
    try {
        if(typeof data === 'string') {
            return JSON.parse(data);
        }

        return data ?? fallback;
    } catch {
        return fallback;
    }
}
