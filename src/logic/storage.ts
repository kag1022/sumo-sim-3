import { RikishiStatus } from './models';

const STORAGE_KEY = 'sumo-maker-v2-data';

export interface SavedRikishi {
    id: string;
    savedAt: string;
    status: RikishiStatus;
}

export const saveRikishi = (status: RikishiStatus): void => {
    const data = loadAllRikishi();
    const newEntry: SavedRikishi = {
        id: crypto.randomUUID(),
        savedAt: new Date().toISOString(),
        status
    };
    data.push(newEntry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const isValidSavedRikishi = (item: any): item is SavedRikishi => {
    // Simple schema check to prevent runtime errors
    return (
        typeof item === 'object' &&
        item !== null &&
        typeof item.id === 'string' &&
        typeof item.status === 'object' &&
        item.status !== null &&
        typeof item.status.shikona === 'string' &&
        typeof item.status.stats === 'object'
    );
};

export const loadAllRikishi = (): SavedRikishi[] => {
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) return [];
    try {
        const parsed = JSON.parse(json);
        if (!Array.isArray(parsed)) return [];
        // Filter out invalid records safely
        return parsed.filter(isValidSavedRikishi);
    } catch (e) {
        console.error('Failed to load data', e);
        return [];
    }
};

export const deleteRikishi = (id: string): void => {
    const data = loadAllRikishi();
    const newData = data.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
};
