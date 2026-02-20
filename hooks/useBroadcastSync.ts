import { useSyncExternalStore } from 'react';

const CHANNEL_NAME = 'schedly_sync_channel';

type ListenersType = Array<() => void>;

// Simple bus to trigger re-renders accross tabs
let listeners: ListenersType = [];
let snapshot = Date.now().toString(); // Our "cache"

const broadcastChannel = typeof window !== 'undefined'
    ? new BroadcastChannel(CHANNEL_NAME)
    : null;

if (broadcastChannel) {
    broadcastChannel.onmessage = (event) => {
        // 2. Update the snapshot ONLY when a message arrives
        snapshot = Date.now().toString();
        
        // 3. Notify React to re-render
        listeners.forEach((l) => l());
    };
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
    const getSnapshot = () => snapshot;

    // 3. Notify function. This function "event" got fired whenever we write to IndexedDB
    const notifyOthers = (actionType: string) => {
        if (broadcastChannel) {
            snapshot = Date.now().toString();
            broadcastChannel.postMessage(actionType);
            listeners.forEach((l) => l());
        }
    }

    const syncState = useSyncExternalStore(subscribe, getSnapshot, () => '0');

    return { syncState, notifyOthers };
}