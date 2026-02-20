import { DB_NAME, PATIENTS_STORE_NAME } from '@/services/idbService';
import { openDB } from 'idb';

self.onmessage = async (e) => {
    const { query } = e.data;
    const db = await openDB(DB_NAME, 3);

    const range = IDBKeyRange.bound(query, query + '\uffff');

    const results = await db.getAllFromIndex(PATIENTS_STORE_NAME, 'name', range);

    self.postMessage(results);
}