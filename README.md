# Schedly Scheduler Concept (Offline-First)
A high-performance, offline-first appointment scheduling system built to demonstrate advanced React patterns, local data persistence, and secure state management.

## Architectural Highlights
This project was built to showcase React capabilities, focusing on data integrity and rendering performance—critical for healthcare practice management.

1. Offline-First with IndexedDB
Instead of treating local storage as a secondary cache, this system uses IndexedDB as the primary source of truth.

Reliability: Practitioners can continue taking treatment notes during internet outages.

Performance: Zero-latency data retrieval for a "snappy" UI.

2. Cross-Tab Synchronization (Broadcast Channel API)
To prevent data loss in multi-tab environments, I implemented a synchronization layer using the Broadcast Channel API.

When an appointment is updated in Tab A, Tab B and C are notified instantly to invalidate their local state and re-sync from IndexedDB, preventing "Last Write Wins" conflicts.

3. Secure-by-Design Persistence
Understanding the sensitivity of medical data:

All "Treatment Notes" are encrypted using the Web Crypto API (AES-GCM) before being persisted to disk.

Encryption keys are derived via PBKDF2 and held only in memory, ensuring that data remains unreadable if the physical device is compromised and the session is closed.

4. Rendering Efficiency
Virtualized Grid: The calendar uses row/column virtualization to handle hundreds of overlapping appointments without degrading DOM performance.

Optimistic UI: State updates are applied instantly with a robust rollback mechanism using custom hooks (useOptimisticTransaction).

## Tech Stack
- Framework: Next.js 15 (App Router)

- Language: TypeScript (Strict Mode)

- Storage: IndexedDB (via idb wrapper)

- State Management: Zustand + Custom Hooks

- Styling: Tailwind CSS

## Key Components & Patterns
`useBroadcastSync`: Custom hook managing the message bus between browser contexts.

`AppointmentStore`: Centralized logic for handling IndexedDB transactions and state reconciliation.

`CryptoService`: Abstraction layer for native Web Crypto APIs.