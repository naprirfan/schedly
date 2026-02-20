export interface Patient {
    id: string;
    name: string;
    version: number;
}

export interface Doctor {
    id: string;
    name: string;
    version: number;
}

export interface Appointment {
    id: string;
    patientId: string;
    doctorId: string;
    version: number;
}