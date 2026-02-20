import { DB_NAME } from '@/services/idbService';
import { openDB } from 'idb';

self.onmessage = async (e) => {
    const { query } = e.data;
    const db = await openDB(DB_NAME, 1);

    const range = IDBKeyRange.bound(query, query + '\uffff');

    const results = await db.getAllFromIndex('patients', 'name', range);

    self.postMessage(results);
}