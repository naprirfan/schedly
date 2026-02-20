import { openDB } from 'https://cdn.jsdelivr.net/npm/idb@8/+esm';

const DB_NAME = 'schedly_offline_db';
const DB_VERSION = 4;
const PATIENTS_STORE_NAME = 'patients';

self.onmessage = async (e) => {
    const { query } = e.data;
    console.log("Worker received query:", query);

    try {
        const db = await openDB(DB_NAME, DB_VERSION);
        const range = IDBKeyRange.bound(query, query + '\uffff');

        console.log("Range:", range.lower, range.upper);
        const results = await db.getAllFromIndex(PATIENTS_STORE_NAME, 'name', range);

        console.log("Search Results found:", results.length);
        self.postMessage(results);

    } catch (err) {
        console.error("Worker Search Error:", err);
    }

};
