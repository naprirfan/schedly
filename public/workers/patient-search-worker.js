import { openDB } from 'https://cdn.jsdelivr.net/npm/idb@8/+esm';

const DB_NAME = 'schedly_offline_db';
const DB_VERSION = 11;

const DB_STORES = {
    PATIENTS: 'patients',
    APPOINTMENTS: 'appointments',
    DOCTORS: 'doctors',
};

self.onmessage = async (e) => {
    const { query } = e.data;
    const lowerQuery = query.toLowerCase();
    console.log("Worker received query:", query);

    try {
        const db = await openDB(DB_NAME, DB_VERSION);
        // Search against the lowercase index
        const range = IDBKeyRange.bound(lowerQuery, lowerQuery + '\uffff');
        const results = await db.getAllFromIndex(DB_STORES.PATIENTS, 'name_lowercase', range);
        
        self.postMessage(results);

    } catch (err) {
        console.error("Worker Search Error:", err);
    }
};
