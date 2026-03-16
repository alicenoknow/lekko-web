const isDev = process.env.NODE_ENV === 'development';

export const logger = {
    error: (message: string, error?: Error | unknown) => {
        if (isDev) {
            console.error(`[ERROR] ${message}`, error);
        }
    },

    warn: (message: string) => {
        if (isDev) {
            console.warn(`[WARN] ${message}`);
        }
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
