export interface FormFieldsType {
    name: string;
    label: string;
    type: string;
}

export const PATIENT_FIELDS = [
    { name: 'name', label: 'Full Name', type: 'text' },
];

export const DOCTOR_FIELDS = [
    { name: 'name', label: 'Doctor Name', type: 'text' },
    { name: 'specialty', label: 'Specialty', type: 'text' }
];

export const APPOINTMENT_FIELDS = [
    { name: 'patientId', label: 'Patient ID', type: 'text' },
    { name: 'patientName', label: 'Patient Name', type: 'text' },
    { name: 'doctorId', label: 'Doctor ID', type: 'text' },
    { name: 'doctorName', label: 'Doctor Name', type: 'text' },
    { name: 'date', label: 'Date', type: 'datetime-local' },
    { name: 'type', label: 'Appointment Type', type: 'text' },
];