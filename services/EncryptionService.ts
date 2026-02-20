const ALGO = 'AES-GCM';

type EncryptionResultType = {
    cipherText: ArrayBuffer;
    iv: Uint8Array;
}

export const EncryptionService = {
    async getSecretKey() {
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
    }
}