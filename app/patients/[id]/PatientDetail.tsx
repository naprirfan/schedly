'use client';

import { TreatmentNote } from "@/components/Patient/TreatmentNote";
import { DataForm } from "@/components/Shared/DataForm";
import { PATIENT_FIELDS } from "@/components/Shared/form-fields";
import { DB_STORES } from "@/constants/db-config";
import { useOptimisticStore } from "@/hooks/useOptimisticStore";
import { initDB } from "@/services/idbService";
import { Patient } from "@/types/db";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type PatientDetailType = {
    id: string;
}

export function PatientDetail({id}: PatientDetailType) {
    const router = useRouter();
    const [patient, setPatient] = useState<Patient>();
    const [loading, setLoading] = useState(false);

    const { updateEntry } = useOptimisticStore(DB_STORES.PATIENTS, {} as Patient);

    const handleSave = async (updatedPatient: Patient) => {
        try {
            const payload: Patient = {
                ...updatedPatient,
                version: (updatedPatient.version || 0) + 1,
            }
            await updateEntry(payload);
            alert("Saved successfully!");
            router.push('/patients');
        } catch (e) {
            alert("Failed to save. Check storage permissions.");
        }
    };

    const fetchPatient = useCallback(async () => {
        setLoading(true);
        const db = await initDB();
        const patientData = await db.get(DB_STORES.PATIENTS, id)
        console.log('patientData', JSON.stringify(patientData));
        setPatient(patientData);
        setLoading(false);
    }, []);
    
    useEffect(() => {
        fetchPatient()
    }, []);

    if (!patient) return <div>Loading...</div>

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Edit Patient</h1>
            </div>

            <DataForm 
                title="New patient form" 
                fields={PATIENT_FIELDS} 
                onSave={handleSave}
                initialData={patient}
            />  

            <div className="mt-8">
                <TreatmentNote patientId={id} patientName={patient.name} />
            </div>
        </div>
    );
}