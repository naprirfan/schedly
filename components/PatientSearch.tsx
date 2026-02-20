import { APPOINTMENT_SAVED, DB_STORES } from '@/constants/db-config';
import { useBroadcastSync } from '@/hooks/useBroadcastSync';
import { initDB } from '@/services/idbService';
import { Appointment, Patient } from '@/types/db';
import { useState, useEffect } from 'react';

let searchWorker: Worker | null = null;

export const PatientSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Patient[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const {notifyOthers} = useBroadcastSync();

    const addAppointment = async (patient: Patient) => {
        const db = await initDB();
        const newAppointment: Appointment = {
            id: crypto.randomUUID(),
            patientId: patient.id,
            patientName: patient.name,
            date: new Date(),
            type: 'Check up',
            version: 1,
            doctorId: 'd1',
            doctorName: 'Dr. Sarah Connor',
        };

        await db.put(DB_STORES.APPOINTMENTS, newAppointment);
        
        notifyOthers(APPOINTMENT_SAVED);
    };

    useEffect(() => {
        if (!searchWorker && typeof window !== 'undefined') {
            console.log("Initializing Singleton Worker...");
            searchWorker = new Worker('/workers/patient-search-worker.js', {
                type: 'module'
            });
        }

        if (searchWorker) {
            searchWorker.onmessage = (e) => {
                console.log("Main thread received results:", e.data);
                setResults(e.data);
                setIsSearching(false);
            };

            searchWorker.onerror = (err) => {
                console.error("Worker Error details:", err);
                setIsSearching(false);
            };
        }
    }, []);

    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);

        const timeoutId = setTimeout(() => {
            if (query.length >= 2 && searchWorker) {
                console.log("Posting message to worker:", query);
                searchWorker.postMessage({ query });
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query]);

    const highlightMatch = (text: string, term: string) => {
        if (!term) return text;
        const parts = text.split(new RegExp(`(${term})`, 'gi'));
        return (
            <span>
                {parts.map((part, i) => 
                    part.toLowerCase() === term.toLowerCase() 
                        ? <mark key={i} className="bg-yellow-200 text-yellow-900 rounded-sm px-0.5">{part}</mark> 
                        : part
                )}
            </span>
        );
    };

    return (
        <div className="relative w-full max-w-md mx-auto">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search patients (e.g. John)..."
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                {isSearching && (
                    <div className="absolute right-3 top-2.5">
                        <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    </div>
                )}
            </div>

            {results.length > 0 && (
                <ul className="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                    {results.map((patient) => (
                        <li 
                            key={patient.id} 
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-none flex justify-between items-center"
                        >
                            <div>
                                <p className="text-sm font-semibold text-gray-800">
                                    {highlightMatch(patient.name, query)}
                                </p>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">ID: {patient.id}</p>
                            </div>
                            <button 
                                onClick={() => addAppointment(patient)}
                                className="text-xs font-bold text-blue-600 hover:text-blue-800 p-1 px-2 bg-blue-50 rounded"
                            >
                                Book new appointment
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {query.length >= 2 && !isSearching && results.length === 0 && (
                <div className="absolute z-10 w-full mt-2 bg-white p-4 border rounded-lg shadow-lg text-center text-gray-500 italic text-sm">
                    No patients found matching "{query}"
                </div>
            )}
        </div>
    );
}