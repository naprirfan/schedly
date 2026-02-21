'use client';

import { DataTable } from "@/components/Shared/DataTable";
import { DB_STORES } from "@/constants/db-config";
import { useBroadcastSync } from "@/hooks/useBroadcastSync";
import { initDB } from "@/services/idbService";
import { Patient } from "@/types/db";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function PatientList() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { syncState } = useBroadcastSync();

    const fetchPatients = useCallback(async () => {
        setLoading(true);
        const db = await initDB();
        const allPatients = await db.getAll(DB_STORES.PATIENTS);
        setPatients(allPatients);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchPatients();
    }, [syncState, fetchPatients]);

    if (loading) return <div>Loading...</div>
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Patients</h1>
                <Link href="/patients/add" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Add Patient</Link>
            </div>
            <DataTable 
                data={patients} 
                columns={[{header: 'Name', accessor: 'name'}, {header: 'ID', accessor: 'id'}]} 
                onViewDetail={(id) => router.push(`/patients/${id}`)}
            />
        </div>
    );
}