/**
 * Secure token storage using AES-GCM authenticated encryption.
 * A random 256-bit key is generated on first use and persisted in localStorage.
 * AES-GCM provides both confidentiality and integrity — no separate hash needed.
 */

import { logger } from '@/lib/logger';

class SecureTokenStorage {
    private readonly STORAGE_KEY = 'secure_auth_token';
    private readonly EXPIRY_KEY = 'token_expiry';
    private readonly REFRESH_TOKEN_KEY = 'secure_refresh_token';
    private readonly REFRESH_AT_KEY = 'token_refresh_at';
    private readonly ENC_KEY_SEED = 'auth_enc_key';

    private cachedKey: CryptoKey | null = null;

    private async getOrCreateKey(): Promise<CryptoKey> {
        if (this.cachedKey) return this.cachedKey;

        let seedBase64 = localStorage.getItem(this.ENC_KEY_SEED);
        let keyMaterial: Uint8Array;

        if (!seedBase64) {
            keyMaterial = crypto.getRandomValues(new Uint8Array(32));
            seedBase64 = btoa(String.fromCharCode(...keyMaterial));
            localStorage.setItem(this.ENC_KEY_SEED, seedBase64);
        } else {
            keyMaterial = Uint8Array.from(atob(seedBase64), (c) =>
                c.charCodeAt(0)
            );
        }

        this.cachedKey = await crypto.subtle.importKey('raw', keyMaterial.buffer as ArrayBuffer, 'AES-GCM', false, [
            'encrypt',
            'decrypt',
        ]);
        return this.cachedKey;
    }

    private async encryptData(data: string): Promise<string> {
        const key = await this.getOrCreateKey();
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encoded = new TextEncoder().encode(data);

        const ciphertext = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            key,
            encoded
        );

        // Prepend IV so decryption can recover it
        const combined = new Uint8Array(12 + ciphertext.byteLength);
        combined.set(iv, 0);
        combined.set(new Uint8Array(ciphertext), 12);

        return btoa(String.fromCharCode(...combined));
    }

    private async decryptData(encryptedData: string): Promise<string | null> {
        try {
            const key = await this.getOrCreateKey();
            const combined = Uint8Array.from(atob(encryptedData), (c) =>
                c.charCodeAt(0)
            );

            const iv = combined.slice(0, 12);
            const ciphertext = combined.slice(12);

            // AES-GCM decryption fails (throws) if the ciphertext was tampered with
            const plaintext = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv },
                key,
                ciphertext
            );

            return new TextDecoder().decode(plaintext);
        } catch {
            logger.error('Failed to decrypt token — data may have been tampered with');
            return null;
        }
    }

    /**
     * Encrypt and store token with expiry metadata.
     */
    async setToken(token: string): Promise<boolean> {
        try {
            if (typeof window === 'undefined') return false;

            const payload = this.extractJWTPayload(token);
            if (!payload?.exp) {
                logger.error('Invalid JWT token — missing expiry');
                return false;
            }

            const encryptedToken = await this.encryptData(token);
            const expiry = payload.exp * 1000;
            const issuedAt = payload.iat ? payload.iat * 1000 : Date.now();
            const refreshAt = issuedAt + (expiry - issuedAt) / 2;

            localStorage.setItem(this.STORAGE_KEY, encryptedToken);
            localStorage.setItem(this.EXPIRY_KEY, expiry.toString());
            localStorage.setItem(this.REFRESH_AT_KEY, refreshAt.toString());

            return true;
        } catch (error) {
            logger.error('Failed to securely store token', error);
            return false;
        }
    }

    /**
     * Retrieve and decrypt the stored token, verifying expiry and AES-GCM integrity.
     */
    async getToken(): Promise<string | null> {
        try {
            if (typeof window === 'undefined') return null;

            const encryptedToken = localStorage.getItem(this.STORAGE_KEY);
            const storedExpiry = localStorage.getItem(this.EXPIRY_KEY);

            if (!encryptedToken || !storedExpiry) return null;

            if (Date.now() >= parseInt(storedExpiry, 10)) {
                logger.warn('Token expired, clearing storage');
                this.clearToken();
                return null;
            }

            const decryptedToken = await this.decryptData(encryptedToken);
            if (!decryptedToken) {
                this.clearToken();
                return null;
            }

            if (!this.isValidJWT(decryptedToken)) {
                logger.error('Invalid JWT structure detected');
                this.clearToken();
                return null;
            }

            return decryptedToken;
        } catch (error) {
            logger.error('Failed to retrieve secure token', error);
            this.clearToken();
            return null;
        }
    }

    /**
     * Clear all token-related data from storage.
     */
    clearToken(): void {
        try {
            if (typeof window === 'undefined') return;
            this.cachedKey = null;
            localStorage.removeItem(this.STORAGE_KEY);
            localStorage.removeItem(this.EXPIRY_KEY);
            localStorage.removeItem(this.REFRESH_TOKEN_KEY);
            localStorage.removeItem(this.REFRESH_AT_KEY);
            localStorage.removeItem(this.ENC_KEY_SEED);
        } catch (error) {
            logger.error('Failed to clear token storage', error);
        }
    }

    hasValidToken(): boolean {
        if (typeof window === 'undefined') return false;
        const stored = localStorage.getItem(this.STORAGE_KEY);
        const expiry = localStorage.getItem(this.EXPIRY_KEY);
        if (!stored || !expiry) return false;
        return Date.now() < parseInt(expiry, 10);
    }

    getTokenExpiry(): number | null {
        try {
            if (typeof window === 'undefined') return null;
            const stored = localStorage.getItem(this.EXPIRY_KEY);
            return stored ? parseInt(stored, 10) : null;
        } catch {
            return null;
        }
    }

    isTokenExpiringSoon(): boolean {
        const expiry = this.getTokenExpiry();
        if (!expiry) return false;
        return expiry - Date.now() < 5 * 60 * 1000;
    }

    async setRefreshToken(token: string): Promise<void> {
        try {
            if (typeof window === 'undefined') return;
            const encrypted = await this.encryptData(token);
            localStorage.setItem(this.REFRESH_TOKEN_KEY, encrypted);
        } catch (error) {
            logger.error('Failed to store refresh token', error);
        }
    }

    async getRefreshToken(): Promise<string | null> {
        try {
            if (typeof window === 'undefined') return null;
            const encrypted = localStorage.getItem(this.REFRESH_TOKEN_KEY);
            if (!encrypted) return null;
            return this.decryptData(encrypted);
        } catch {
            return null;
        }
    }

    isTokenAtHalfLife(): boolean {
        try {
            if (typeof window === 'undefined') return false;
            const stored = localStorage.getItem(this.REFRESH_AT_KEY);
            if (!stored) return false;
            return Date.now() >= parseInt(stored, 10);
        } catch {
            return false;
        }
    }

    private extractJWTPayload(
        token: string
    ): { exp?: number; iat?: number } | null {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) return null;
            return JSON.parse(atob(parts[1]!));
        } catch {
            return null;
        }
    }

    private isValidJWT(token: string): boolean {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) return false;
            const header = JSON.parse(atob(parts[0]!));
            const payload = JSON.parse(atob(parts[1]!));
            return !!(header && payload && header.typ && payload.exp);
        } catch {
            return false;
        }
    }
}

export const secureTokenStorage = new SecureTokenStorage();
