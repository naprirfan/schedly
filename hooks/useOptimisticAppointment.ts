import { useState } from 'react';
import { saveAppointment } from '@/services/idbService';
import { useBroadcastSync } from './useBroadcastSync';

export const useOptimisticAppointment = (initialData: any) => {
  const [appointment, setAppointment] = useState(initialData);
  const { notifyOthers } = useBroadcastSync();

  const updateAppointment = async (newData: any) => {
    // 1. For rollback
    const previousState = { ...appointment };

    // 2. Optimistic Update: Update UI immediately
    setAppointment(newData);

    try {
      // 3. Attempt to persist to IndexedDB
      await saveAppointment(newData, notifyOthers);
    } catch (error) {
      // 4. Rollback: If DB fails, revert UI to previous state
      console.error("Persistence failed, rolling back UI", error);
      setAppointment(previousState);
      alert('Update appointment failed');
    }
  };

  return [appointment, updateAppointment];
};