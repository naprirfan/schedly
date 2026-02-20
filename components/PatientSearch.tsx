import { useBroadcastSync } from '@/hooks/useBroadcastSync';
import { Patient } from '@/types/db';
import { useState, useEffect } from 'react';

let searchWorker: Worker | null = null;

export const PatientSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Patient[]>([]);
    const {syncState} = useBroadcastSync();

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
            };

            searchWorker.onerror = (err) => {
                console.error("Worker Error details:", err);
            };
        }
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (query.length >= 2 && searchWorker) {
                console.log("Posting message to worker:", query);
                searchWorker.postMessage({ query });
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query]);

    return (
        <div className="p-4 border-b">
            <input 
                type="text" 
                placeholder="Search patients (e.g. 'Jo')..."
                className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={(e) => setQuery(e.target.value)}
            />
            <ul className="mt-2 space-y-1">
                {results.map(p => <li key={p.id} className="text-sm p-1 hover:bg-gray-100">{p.name}</li>)}
            </ul>
        </div>
    )
}