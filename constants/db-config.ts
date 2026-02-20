export const DB_NAME = 'schedly_offline_db';
export const DB_VERSION = 11;

export const DB_STORES = {
    PATIENTS: 'patients',
    APPOINTMENTS: 'appointments',
    DOCTORS: 'doctors',
} as const;

export const SYNC_CHANNEL = 'schedly_sync_channel';
export const APPOINTMENT_SAVED = 'APPOINTMENT_SAVED';
