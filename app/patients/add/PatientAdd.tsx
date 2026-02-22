'use client';

import { DataForm } from "@/components/Shared/DataForm";
import { PATIENT_FIELDS } from "@/components/Shared/form-fields";
import { DB_STORES } from "@/constants/db-config";
import { useOptimisticStore } from "@/hooks/useOptimisticStore";
import { Patient } from "@/types/db";
import { useRouter } from "next/navigation";

export function PatientAdd() {
    const router = useRouter();

    const { updateEntry } = useOptimisticStore(DB_STORES.PATIENTS, {} as Patient);

    const handleSave = async (updatedPatient: Patient) => {
        try {
            const newPatient: Patient = {
                ...updatedPatient,
                id: crypto.randomUUID(),
                name_lowercase: updatedPatient.name.toLowerCase(),
                version: 0,
            }
            await updateEntry(newPatient);
            alert("Saved successfully!");
            router.push('/patients');
        } catch (e) {
            alert("Failed to save. Check storage permissions.");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Add new Patient</h1>
            </div>
            <DataForm 
                title="New patient form" 
                fields={PATIENT_FIELDS} 
                onSave={handleSave}
            />  
        </div>
    );
}