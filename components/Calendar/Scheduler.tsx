'use client';

import { DB_STORES } from "@/constants/db-config";
import { useBroadcastSync } from "@/hooks/useBroadcastSync";
import { initDB } from "@/services/idbService";
import { Appointment } from "@/types/db";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export const Scheduler = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const { syncState } = useBroadcastSync();

    const fetchAppointments = useCallback(async () => {
        const db = await initDB();
        const allAppointments = await db.getAll(DB_STORES.APPOINTMENTS);

        const sortedByDate = allAppointments.sort((a, b) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setAppointments(sortedByDate);
    }, []);

    useEffect(() => {
        fetchAppointments();
    }, [syncState, fetchAppointments]);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div key={day} className="bg-gray-50 p-3 text-center font-bold text-xs uppercase tracking-wider text-gray-500 border-b border-gray-200">
                        {day}
                    </div>
                ))}
                
                {appointments.length > 0 ? (
                    appointments.map((apt) => (
                        <div key={apt.id} className="p-2 bg-blue-50 border-l-2 border-blue-400 rounded-sm text-[11px] font-medium text-blue-900 shadow-sm group-hover:bg-blue-100">
                            <span>{apt.patientName}</span>
                            <div className="text-[9px] text-blue-500 mt-0.5 italic">{apt.type}</div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-7 bg-white p-12 text-center text-gray-400 italic text-sm">
                        No appointments scheduled for this week.
                    </div>
                )}
            </div>
        </div>
    );
};