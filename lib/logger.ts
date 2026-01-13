/**
 * Simple logging utility for the application
 */

const isDev = process.env.NODE_ENV === 'development';

export const logger = {
    error: (message: string, error?: Error | unknown) => {
        console.error(`[ERROR] ${message}`, error);
    },

    warn: (message: string) => {
        console.warn(`[WARN] ${message}`);
    },

    info: (message: string) => {
        if (isDev) {
            console.info(`[INFO] ${message}`);
        }
    },

    debug: (message: string) => {
        if (isDev) {
            console.debug(`[DEBUG] ${message}`);
        }
    },
};
