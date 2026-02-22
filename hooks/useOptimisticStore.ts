// hooks/useOptimisticStore.ts
import { useState } from 'react';
import { useBroadcastSync } from './useBroadcastSync';
import { initDB } from '@/services/idbService';

export function useOptimisticStore<T extends { id: string | number; version: number }>(
  storeName: string, 
  initialData: T
) {
  const [data, setData] = useState<T>(initialData);
  const { notifyOthers } = useBroadcastSync();

  const updateEntry = async (newData: T) => {
    const previousState = { ...data };
    
    // 1. UI Optimism: Update local state immediately for perceived speed
    setData(newData);

    try {
      const db = await initDB();
      
      // 2. Conflict Detection (The Guard)
      const existingRecord = await db.get(storeName, newData.id);
      
      if (existingRecord && existingRecord.version > previousState.version) {
          // A newer version exists in the DB (likely from another tab/sync)
          alert('Conflict detected');
          throw new Error('CONFLICT_DETECTED');
      }

      // 3. Prepare Final Record
      const recordWithNewVersion = {
          ...newData,
          version: (existingRecord?.version || 0) + 1,
          updatedAt: new Date().toISOString()
      };

      // 4. Actual Persistence
      await db.put(storeName, recordWithNewVersion);
      
      // Update local state one last time with the server-side version
      setData(recordWithNewVersion);

      // 5. Global Sync
      notifyOthers(`${storeName.toUpperCase()}_UPDATED`);
      
    } catch (error) {
      // 6. Rollback
      setData(previousState);
      
      if (error instanceof Error && error.message === 'CONFLICT_DETECTED') {
          console.warn("Version mismatch! Rolling back to latest known state.");
          // Trigger a re-fetch or alert the user
      }
      
      throw error; 
    }
  };

  return { data, updateEntry };
}