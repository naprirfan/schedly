export interface Patient {
    id: string;
    name: string;
    name_lowercase: string;
    version: number;
}

export interface Doctor {
    id: string;
    name: string;
    specialty: string;
    version: number;
}

export type AppointmentType = 'Initial Consultation' | 'Follow-up' | 'Check up';
export interface Appointment {
    id: string;
    patientId: string;
    patientName: string;
    doctorId: string;
    doctorName: string;
    date: Date;
    type: AppointmentType;
    version: number;
}