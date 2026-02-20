import { Appointment, Patient } from '@/types/db';
import { openDB } from 'idb';

export const DB_NAME = 'schedly_offline_db';
export const DB_VERSION = 3;

export const APPOINTMENTS_STORE_NAME = 'appointments';
export const PATIENTS_STORE_NAME = 'patients';
export const DOCTORS_STORE_NAME = 'doctors';

export const APPOINTMENT_SAVED = 'APPOINTMENT_SAVED';

export const initDB = async () => {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(APPOINTMENTS_STORE_NAME)) {
                db.createObjectStore(APPOINTMENTS_STORE_NAME, { keyPath: 'id' });
            }

            if (!db.objectStoreNames.contains(PATIENTS_STORE_NAME)) {
                db.createObjectStore(PATIENTS_STORE_NAME, { keyPath: 'id' });
            }

            if (!db.objectStoreNames.contains(DOCTORS_STORE_NAME)) {
                db.createObjectStore(DOCTORS_STORE_NAME, { keyPath: 'id' });
            }
        }
    });
}

export const saveAppointment = async (appointment: Appointment, notify: (action: string) => void) => {
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

    // Check if we already have data to avoid duplicate seeding
    const existingPatients = await db.count(PATIENTS_STORE_NAME);
    if (existingPatients > 0) return; 

    console.log("Seeding initial data...");

    const patients = [
        { id: 'p1', name: 'M. Irfan', version: 1 },
        { id: 'p2', name: 'John Doe', version: 1 },
        { id: 'p3', name: 'Jane Smith', version: 1 },
    ];

    const doctors = [
        { id: 'd1', name: 'Dr. Sarah Connor', specialty: 'Physiotherapy' },
        { id: 'd2', name: 'Dr. Joel Miller', specialty: 'Osteopathy' },
    ];

    const initialAppointments = [
        { 
            id: 'a1', 
            patientId: 'p1', 
            patientName: 'M. Irfan', 
            doctorId: 'd1', 
            time: '09:00 AM', 
            type: 'Initial Consultation',
            date: '2026-02-20' 
        },
        { 
            id: 'a2', 
            patientId: 'p2', 
            patientName: 'John Doe', 
            doctorId: 'd2', 
            time: '11:30 AM', 
            type: 'Follow-up',
            date: '2026-02-20' 
        }
    ];

    // Multi-store transaction for data integrity
    const tx = db.transaction(
        [PATIENTS_STORE_NAME, DOCTORS_STORE_NAME, APPOINTMENTS_STORE_NAME], 
        'readwrite'
    );

    const pStore = tx.objectStore(PATIENTS_STORE_NAME);
    const dStore = tx.objectStore(DOCTORS_STORE_NAME);
    const aStore = tx.objectStore(APPOINTMENTS_STORE_NAME);

    for (const p of patients) await pStore.put(p);
    for (const d of doctors) await dStore.put(d);
    for (const a of initialAppointments) await aStore.put(a);

    await tx.done;
    console.log("Seeding complete.");
};
