// ============================================
// CRYPTO.JS — AES-256 Encryption Engine
// ============================================

const Crypto = {

    // Converts a password into a secure encryption key
    async getKey(password, salt) {
        const enc = new TextEncoder();
        const keyMaterial = await window.crypto.subtle.importKey(
            "raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]
        );
        return window.crypto.subtle.deriveKey(
            { name: "PBKDF2", salt: enc.encode(salt), iterations: 100000, hash: "SHA-256" },
            keyMaterial,
            { name: "AES-GCM", length: 256 },
            false,
            ["encrypt", "decrypt"]
        );
    },

    // Encrypts data with a password
    async encrypt(data, password) {
        const salt = "inventory-app-salt-v1";
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const key = await this.getKey(password, salt);
        const enc = new TextEncoder();
        const encrypted = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv },
            key,
            enc.encode(JSON.stringify(data))
        );
        const result = {
            iv: Array.from(iv),
            data: Array.from(new Uint8Array(encrypted))
        };
        return btoa(JSON.stringify(result));
    },

    // Decrypts data with a password
    async decrypt(encryptedStr, password) {
        try {
            const salt = "inventory-app-salt-v1";
            const parsed = JSON.parse(atob(encryptedStr));
            const iv = new Uint8Array(parsed.iv);
            const data = new Uint8Array(parsed.data);
            const key = await this.getKey(password, salt);
            const decrypted = await window.crypto.subtle.decrypt(
                { name: "AES-GCM", iv },
                key,
                data
            );
            return JSON.parse(new TextDecoder().decode(decrypted));
        } catch (e) {
            return null; // Wrong password or corrupted data
        }
    }
};