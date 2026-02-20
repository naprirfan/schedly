'use client';

import { useState, useEffect } from 'react';
import { EncryptionService } from '@/services/EncryptionService';
import { initDB } from '@/services/idbService';
import { DB_STORES } from '@/constants/db-config';

interface Props {
    patientId: string;
    patientName: string;
}

export const TreatmentNote = ({ patientId, patientName }: Props) => {
    const [note, setNote] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    // Load and Decrypt existing note
    useEffect(() => {
        const loadNote = async () => {
            const db = await initDB();
            const encryptedData = await db.get(DB_STORES.NOTES, patientId);
            
            if (encryptedData) {
                try {
                    const decryptedText = await EncryptionService.decrypt(
                        encryptedData.cipherText, 
                        encryptedData.iv
                    );
                    setNote(decryptedText);
                } catch (err) {
                    console.error("Failed to decrypt note:", err);
                }
            }
            setLoading(false);
        };
        loadNote();
    }, [patientId]);

    const handleSave = async () => {
        setLoading(true);
        try {
            // ENCRYPT: Convert plain text to CipherText + IV
            const { cipherText, iv } = await EncryptionService.encrypt(note);
            
            const db = await initDB();
            await db.put(DB_STORES.NOTES, {
                id: patientId,
                cipherText,
                iv,
                updatedAt: new Date().toISOString()
            });

            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
        } catch (err) {
            console.error("Encryption/Save error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="animate-pulse text-gray-400">Securing connection...</div>;

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 mt-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
                Clinical Notes: <span className="text-blue-600">{patientName}</span>
            </h3>
            
            <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Enter sensitive clinical findings..."
                className="w-full h-40 p-4 border rounded-md bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none text-gray-700"
            />

            <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-400 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    End-to-End Encrypted (AES-GCM)
                </span>
                
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                        isSaved ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                    {isSaved ? 'Saved Securely' : 'Save Encrypted Note'}
                </button>
            </div>
        </div>
    );
};