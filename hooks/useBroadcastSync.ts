import { useSyncExternalStore } from 'react';

const CHANNEL_NAME = 'schedly_sync_channel';

type ListenersType = Array<() => void>;

// Simple bus to trigger re-renders accross tabs
let listeners: ListenersType = [];

const broadcastChannel = typeof window !== 'undefined'
    ? new BroadcastChannel(CHANNEL_NAME)
    : null;

if (broadcastChannel) {
    broadcastChannel.onmessage = (event) => {
        console.log('Syncing tabs due to:', event.data);
        listeners.forEach(l => l());
    }
}

export const useBroadcastSync = () => {
    // 1. Subscribe logic. React calls this to register a re-render trigger
    const subscribe = (listener: () => void) => {
        listeners = [...listeners, listener];
        return () => {
            listeners = listeners.filter(l => l !== listener);
        }
    }

    // 2. Snapshot logic. Return timestamp just to force react to see a change
    const getSnapshot = () => {
        return Date.now().toString();
    };

    // 3. Notify function. This function "event" got fired whenever we write to IndexedDB
    const notifyOthers = (actionType: string) => {
        if (broadcastChannel) {
            broadcastChannel.postMessage(actionType);
        }
    }

    const syncState = useSyncExternalStore(subscribe, getSnapshot, () => '0');

    return { syncState, notifyOthers };
}