import { APPOINTMENT_SAVED, DB_NAME, DB_STORES, DB_VERSION } from '@/constants/db-config';
import { Appointment, Doctor, Patient } from '@/types/db';
import { openDB } from 'idb';

export const initDB = async () => {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(DB_STORES.APPOINTMENTS)) {
                db.createObjectStore(DB_STORES.APPOINTMENTS, { keyPath: 'id' });
            }

            if (!db.objectStoreNames.contains(DB_STORES.PATIENTS)) {
                db.createObjectStore(DB_STORES.PATIENTS, { keyPath: 'id' });
            }

            if (!db.objectStoreNames.contains(DB_STORES.DOCTORS)) {
                db.createObjectStore(DB_STORES.DOCTORS, { keyPath: 'id' });
            }
        }
    });
}

export const saveAppointment = async (appointment: Appointment, notify: (action: string) => void) => {
    const db = await initDB();

    // Start an atomic transaction
    const trx = db.transaction(DB_STORES.APPOINTMENTS, 'readwrite');
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
    const existingPatients = await db.count(DB_STORES.PATIENTS);
    if (existingPatients > 0) return; 

    console.log("Seeding initial data...");

    const patients: Patient[] = [
        { id: 'p1', name: 'Irfan', version: 1 },
        { id: 'p2', name: 'John Doe', version: 1 },
        { id: 'p3', name: 'Jane Smith', version: 1 },
    ];

    const doctors: Doctor[] = [
        { id: 'd1', name: 'Dr. Sarah Connor', specialty: 'Physiotherapy', version: 1 },
        { id: 'd2', name: 'Dr. Joel Miller', specialty: 'Osteopathy', version: 1 },
    ];

    const date = new Date();
    date.setDate(date.getDate() - 1);

    const initialAppointments: Appointment[] = [
        { 
            id: 'a1', 
            patientId: 'p1', 
            patientName: 'Irfan', 
            doctorId: 'd1', 
            doctorName: 'Dr. Sarah Connor',
            date, 
            type: 'Initial Consultation',
            version: 1,
        },
        { 
            id: 'a2', 
            patientId: 'p2', 
            patientName: 'John Doe', 
            doctorName: 'Dr. Joel Miller',
            doctorId: 'd2', 
            type: 'Follow-up',
            date,
            version: 1,
        }
    ];

    // Multi-store transaction for data integrity
    const tx = db.transaction(
        [DB_STORES.PATIENTS, DB_STORES.DOCTORS, DB_STORES.APPOINTMENTS], 
        'readwrite'
    );

    const pStore = tx.objectStore(DB_STORES.PATIENTS);
    const dStore = tx.objectStore(DB_STORES.DOCTORS);
    const aStore = tx.objectStore(DB_STORES.APPOINTMENTS);

    for (const p of patients) await pStore.put(p);
    for (const d of doctors) await dStore.put(d);
    for (const a of initialAppointments) await aStore.put(a);

    await tx.done;
    console.log("Seeding complete.");
};
