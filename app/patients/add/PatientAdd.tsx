'use client';

import { DataForm } from "@/components/Shared/DataForm";
import { PATIENT_FIELDS } from "@/components/Shared/form-fields";
import { Patient } from "@/types/db";

export function PatientAdd() {
    const handleSave = async (updatedPatient: Patient) => {
        try {
            // await updateEntry(updatedPatient);
            alert("Saved successfully!");
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