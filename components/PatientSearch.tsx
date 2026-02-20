import { useBroadcastSync } from '@/hooks/useBroadcastSync';
import { Patient } from '@/types/db';
import { useState, useEffect, useMemo } from 'react';

export const PatientSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Patient[]>([]);
    const {syncState} = useBroadcastSync();

    // Persistent worker instance
    const worker = useMemo(() => 
        typeof window !== 'undefined' ? new Worker('/worker/patient-search-worker.js') : null
    , []);

    useEffect(() => {
        if (!worker) return;

        worker.onmessage = e => setResults(e.data);

        // Debounce search to 150ms
        const timeoutId = setTimeout(() => {
            if (query.length >= 2) worker.postMessage({ query });
        }, 150);

        return () => clearTimeout(timeoutId);
    }, [query, worker, syncState]);

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