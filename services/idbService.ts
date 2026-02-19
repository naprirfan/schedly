import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'schedly_offline_db';
const STORE_NAME = 'appointments';

export const APPOINTMENT_SAVED = 'APPOINTMENT_SAVED';

export const initDB = async () => {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        }
    });
}

export const saveAppointment = async (appointment: any, notify: (action: string) => void) => {
    const db = await initDB();

    // Start an atomic transaction
    const trx = db.transaction(STORE_NAME, 'readwrite');
    try {
        await trx.store.put(appointment);
        await trx.done;

        // Triggers sync accross tabs
        notify(APPOINTMENT_SAVED);
    } catch (err) {
        console.error('Failed to save appointment. Transaction rolled back', err);
    }
}