/**
 * Secure token storage with encryption and tampering detection
 * Implements enhanced security for localStorage JWT storage
 */

import { logger } from '@/lib/logger';

class SecureTokenStorage {
    private readonly STORAGE_KEY = 'secure_auth_token';
    private readonly INTEGRITY_KEY = 'token_integrity';
    private readonly EXPIRY_KEY = 'token_expiry';

    private encryptData(data: string): string {
        const key = this.generateKey();
        let encrypted = '';

        for (let i = 0; i < data.length; i++) {
            encrypted += String.fromCharCode(
                data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
            );
        }

        return btoa(encrypted);
    }

    private decryptData(encryptedData: string): string | null {
        try {
            const key = this.generateKey();
            const encrypted = atob(encryptedData);
            let decrypted = '';

            for (let i = 0; i < encrypted.length; i++) {
                decrypted += String.fromCharCode(
                    encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length)
                );
            }

            return decrypted;
        } catch (error) {
            logger.error('Failed to decrypt token data', error);
            return null;
        }
    }

    private generateKey(): string {
        const fingerprint = this.getBrowserFingerprint();
        const secret = 'lekko_web_secure_key_2024'; // In production, use env var
        return btoa(fingerprint + secret).slice(0, 32);
    }

    private getBrowserFingerprint(): string {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.textBaseline = 'top';
            ctx.font = '14px Arial';
            ctx.fillText('Browser fingerprint', 2, 2);
        }

        return btoa(
            [
                navigator.userAgent,
                navigator.language,
                screen.width + 'x' + screen.height,
                new Date().getTimezoneOffset(),
                canvas.toDataURL(),
            ].join('|')
        ).slice(0, 16);
    }

    private calculateIntegrity(data: string): string {
        // Simple integrity hash
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(36);
    }

    /**
     * Securely store token with encryption and integrity check
     */
    setToken(token: string): boolean {
        try {
            // Check if we're in a browser environment
            if (typeof window === 'undefined') {
                return false;
            }

            // Extract expiry from JWT payload
            const payload = this.extractJWTPayload(token);
            if (!payload || !payload.exp) {
                logger.error('Invalid JWT token - missing expiry');
                return false;
            }

            const encryptedToken = this.encryptData(token);
            const integrity = this.calculateIntegrity(token);
            const expiry = payload.exp * 1000; // Convert to milliseconds

            localStorage.setItem(this.STORAGE_KEY, encryptedToken);
            localStorage.setItem(this.INTEGRITY_KEY, integrity);
            localStorage.setItem(this.EXPIRY_KEY, expiry.toString());

            return true;
        } catch (error) {
            logger.error('Failed to securely store token', error);
            return false;
        }
    }

    /**
     * Securely retrieve and validate token
     */
    getToken(): string | null {
        try {
            // Check if we're in a browser environment
            if (typeof window === 'undefined') {
                return null;
            }

            const encryptedToken = localStorage.getItem(this.STORAGE_KEY);
            const storedIntegrity = localStorage.getItem(this.INTEGRITY_KEY);
            const storedExpiry = localStorage.getItem(this.EXPIRY_KEY);

            if (!encryptedToken || !storedIntegrity || !storedExpiry) {
                return null;
            }

            // Check expiry
            const expiryTime = parseInt(storedExpiry, 10);
            const now = Date.now();

            if (now >= expiryTime) {
                logger.warn('Token expired, clearing storage');
                this.clearToken();
                return null;
            }

            // Decrypt token
            const decryptedToken = this.decryptData(encryptedToken);
            if (!decryptedToken) {
                logger.error('Failed to decrypt token');
                this.clearToken();
                return null;
            }

            // Verify integrity
            const calculatedIntegrity = this.calculateIntegrity(decryptedToken);
            if (calculatedIntegrity !== storedIntegrity) {
                logger.error(
                    'Token integrity check failed - possible tampering detected'
                );
                this.clearToken();
                return null;
            }

            // Additional JWT validation
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
     * Clear all token-related data
     */
    clearToken(): void {
        try {
            if (typeof window === 'undefined') {
                return;
            }

            localStorage.removeItem(this.STORAGE_KEY);
            localStorage.removeItem(this.INTEGRITY_KEY);
            localStorage.removeItem(this.EXPIRY_KEY);
        } catch (error) {
            logger.error('Failed to clear token storage', error);
        }
    }

    /**
     * Check if token exists and is valid
     */
    hasValidToken(): boolean {
        return this.getToken() !== null;
    }

    /**
     * Get token expiry time
     */
    getTokenExpiry(): number | null {
        try {
            if (typeof window === 'undefined') {
                return null;
            }

            const storedExpiry = localStorage.getItem(this.EXPIRY_KEY);
            return storedExpiry ? parseInt(storedExpiry, 10) : null;
        } catch {
            return null;
        }
    }

    /**
     * Check if token will expire soon (within 5 minutes)
     */
    isTokenExpiringSoon(): boolean {
        const expiry = this.getTokenExpiry();
        if (!expiry) return false;

        const fiveMinutes = 5 * 60 * 1000;
        return expiry - Date.now() < fiveMinutes;
    }

    private extractJWTPayload(token: string): { exp?: number } | null {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) return null;

            const payload = JSON.parse(atob(parts[1]));
            return payload;
        } catch {
            return null;
        }
    }

    private isValidJWT(token: string): boolean {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) return false;

            // Basic JWT structure validation
            const header = JSON.parse(atob(parts[0]));
            const payload = JSON.parse(atob(parts[1]));

            return !!(header && payload && header.typ && payload.exp);
        } catch {
            return false;
        }
    }
}

// Export singleton instance
export const secureTokenStorage = new SecureTokenStorage();
