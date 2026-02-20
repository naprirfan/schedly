import { DB_NAME } from '@/services/idbService';
import { openDB } from 'idb';

export interface Patient {
    id: string;
    name: string;
    version: number;
}

export const initDB = async () => {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('patients')) {
                const store = db.createObjectStore('patients', { keyPath: 'id' });
                store.createIndex('name', 'name'); // For our Prefix Search
            }
        },
    });
};

export const seedDatabase = async () => {
    const db = await initDB();
    const patients: Patient[] = [
        { id: '1', name: 'M. Irfan', version: 1 },
        { id: '2', name: 'John Doe', version: 1 },
        { id: '3', name: 'Jane Smith', version: 1 },
    ];
    const tx = db.transaction('patients', 'readwrite');
    
    for (const p of patients) await tx.store.put(p);
    await tx.done;
};