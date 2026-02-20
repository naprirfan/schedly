'use client';

import { useBroadcastSync } from "@/hooks/useBroadcastSync";
import { APPOINTMENTS_STORE_NAME, initDB } from "@/services/idbService";
import { Appointment } from "@/types/db";
import { useCallback, useEffect, useState } from "react";

export const Scheduler = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const { syncState } = useBroadcastSync();

    const fetchAppointments = useCallback(async () => {
        const db = await initDB();
        const allAppointments = await db.getAll(APPOINTMENTS_STORE_NAME);
        setAppointments(allAppointments)
    }, []);

    useEffect(() => {
        fetchAppointments();
    }, [syncState]);

    return (
        <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="bg-gray-100 p-2 text-center font-bold text-sm">
                    {day}
                </div>
            ))}
            {appointments.length > 0 ? (
                appointments.map((apt) => (
                <div key={apt.id} className="min-h-[150px] bg-white p-3 hover:bg-blue-50 transition-colors cursor-pointer group border-t border-gray-100">
                    <span className="text-xs text-gray-400 font-mono block mb-1">{apt.date}</span>
                    <div className="p-2 bg-blue-100 border-l-4 border-blue-500 rounded text-xs font-medium text-blue-800 shadow-sm">
                        Patient: {apt.patientName}
                    <div className="text-[10px] text-blue-600 mt-1">{apt.type || 'General Consultation'}</div>
                    </div>
                </div>
                ))
            ) : (
                <div className="col-span-7 bg-white p-10 text-center text-gray-400 italic">
                    No appointments scheduled.
                </div>
            )}
        </div>
    )
}