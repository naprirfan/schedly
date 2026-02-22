# Schedly Scheduler Concept (Offline-First)

A high-performance, offline-first appointment scheduling system built to demonstrate advanced React patterns, local data persistence, and secure state management.

## Architectural Decisions
This application is designed as an offline-first, high-concurrency clinical management tool. The following architectural choices were made to ensure the system is resilient, performant, and secure.

### 1. Offline-First Persistence (IndexedDB + idb)
Instead of relying on a constant cloud connection, the application uses IndexedDB as the primary data source.

Why: Clinical environments often have "dead zones" or spotty Wi-Fi. By using IndexedDB via the idb library, the app remains fully functional without a network.

Version Control: Every record includes a version field. This enables Optimistic Concurrency Control, preventing data loss if a record is updated simultaneously in multiple tabs or devices.

### 2. Multi-Tab Synchronization (BroadcastChannel)
To solve the "stale data" problem across browser tabs, I implemented a custom `useBroadcastSync` hook.

Why: If a user updates a patient's details in one tab, the Scheduler in the second tab must reflect that change immediately.

Mechanism: When a write occurs in one tab, a notification is sent via a BroadcastChannel. Other tabs listen for this event and trigger a re-validation of their local state.

### 3. High-Performance Search (Web Workers)
Search operations—especially those involving lowercase normalization and prefix matching—are computationally expensive as the dataset grows.

Why: Moving search logic to a Web Worker keeps the Main Thread (UI) at a consistent 60fps, preventing "jank" during typing.

Implementation: The search worker uses a Singleton Pattern to prevent memory leaks and unnecessary thread creation during React re-renders.

### 4. Client-Side Encryption (AES-GCM)
Medical notes require a higher tier of security than standard metadata.

Why: To comply with privacy standards (like HIPAA/GDPR principles), sensitive treatment notes are encrypted before they are stored in IndexedDB.

Security: Using the native Web Crypto API (AES-GCM), notes are stored as encrypted CipherText. Even if the local database is inspected, the clinical data remains unreadable without the secret key.

### 5. Reactive UX & Optimistic Updates
To provide a "snappy" desktop-like experience, the UI utilizes Optimistic Updates.

Why: When a user saves a change, the UI updates immediately before the IndexedDB transaction is confirmed.

Resilience: If the database write fails (e.g., due to a version conflict), the system automatically rolls back the UI state and notifies the user, ensuring the "Source of Truth" remains consistent.

## Tech Stack
- Framework: Next.js 15 (App Router)
- Language: TypeScript (Strict Mode)
- Storage: IndexedDB (via idb wrapper)
- Styling: Tailwind CSS

## Key Components & Patterns
- `useBroadcastSync`: Custom hook managing the message bus between browser contexts.
- `EncryptionService`: Abstraction layer for native Web Crypto APIs.
- `useOptimisticStore`: Custom hook enabling the optimistic UI approach.
