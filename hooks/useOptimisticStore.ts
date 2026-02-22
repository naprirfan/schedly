// hooks/useOptimisticStore.ts
import { useState } from 'react';
import { useBroadcastSync } from './useBroadcastSync';
import { initDB } from '@/services/idbService';

export function useOptimisticStore<T extends { id: string | number }>(
  storeName: string, 
  initialData: T
) {
  const [data, setData] = useState<T>(initialData);
  const { notifyOthers } = useBroadcastSync();

  const updateEntry = async (newData: T) => {
    const previousState = { ...data };
    
    // 1. Optimistic Update
    setData(newData);

    try {
      // 2. Persist to IndexedDB
      const db = await initDB();
      await db.put(storeName, newData);
      
      // 3. Sync other tabs
      notifyOthers(`${storeName.toUpperCase()}_UPDATED`);
    } catch (error) {
      console.error(`Update to ${storeName} failed, rolling back`, error);
      setData(previousState);
      throw error; // Let the UI handle the error state/toast
    }
  };

  return { data, updateEntry };
};