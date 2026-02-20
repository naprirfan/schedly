import { Patient } from '@/types/db';
import { openDB } from 'idb';

export const DB_NAME = 'schedly_offline_db';
export const APPOINTMENTS_STORE_NAME = 'appointments';
export const PATIENTS_STORE_NAME = 'patients';

export const APPOINTMENT_SAVED = 'APPOINTMENT_SAVED';

export const initDB = async () => {
    return openDB(DB_NAME, 2, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(APPOINTMENTS_STORE_NAME)) {
                db.createObjectStore(APPOINTMENTS_STORE_NAME, { keyPath: 'id' });
            }

            if (!db.objectStoreNames.contains(PATIENTS_STORE_NAME)) {
                db.createObjectStore(PATIENTS_STORE_NAME, { keyPath: 'id' });
            }
        }
    });
}

export const saveAppointment = async (appointment: any, notify: (action: string) => void) => {
    const db = await initDB();

    // Start an atomic transaction
    const trx = db.transaction(APPOINTMENTS_STORE_NAME, 'readwrite');
    try {
        await trx.store.put(appointment);
        await trx.done;

        // Triggers sync accross tabs
        notify(APPOINTMENT_SAVED);
    } catch (err) {
        console.error('Failed to save appointment. Transaction rolled back', err);
    }
}

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
