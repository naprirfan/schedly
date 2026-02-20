import { useState, useEffect, useMemo } from 'react';

export const PatientSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    // Persistent worker instance
    const worker = useMemo(() => 
        typeof window !== 'undefined' ? new Worker('/worker/search-worker.js') : null
    , []);

    useEffect(() => {
        if (!worker) return;

        worker.onmessage = e => setResults(e.data);

        // Debounce search to 150ms
        const timeoutId = setTimeout(() => {
            if (query.length >= 2) worker.postMessage({ query });
        }, 150);

        return () => clearTimeout(timeoutId);
    }, []);
}