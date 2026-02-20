const ALGO = 'AES-GCM';

type EncryptionResultType = {
    cipherText: ArrayBuffer;
    iv: Uint8Array;
}

export const EncryptionService = {
    async getSecretKey() {
        // Cliniko Tip: In a real app, this secret would be derived from the user's login session
        const rawKey = new TextEncoder().encode('schedly-super-secret-key');
        const hash = await crypto.subtle.digest('SHA-256', rawKey);
        return crypto.subtle.importKey('raw', hash, { name: ALGO }, false, ['encrypt', 'decrypt']);
    },

    async encrypt(text: string): Promise<EncryptionResultType> {
        const key = await this.getSecretKey();
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encoded = new TextEncoder().encode(text);
        const cipherText = await crypto.subtle.encrypt({ name: ALGO, iv }, key, encoded);
        return { cipherText, iv };
    },

    async decrypt(cipherText: ArrayBuffer, iv: Uint8Array): Promise<string> {
        const key = await this.getSecretKey();
        try {
            const decrypted = await crypto.subtle.decrypt(
                { 
                    name: ALGO, 
                    iv: iv as BufferSource 
                },
                key,
                cipherText as ArrayBuffer
            );
            return new TextDecoder().decode(decrypted);
        } catch (e) {
            console.error("Decryption failed:", e);
            throw new Error("Could not decrypt data");
        }
    }
}