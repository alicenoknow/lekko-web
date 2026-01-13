import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import { User } from '@/types/user';
import { logger } from '@/lib/logger';
import { secureTokenStorage } from '@/lib/security/tokenStorage';

interface UserStore {
    user: User | null;
    token: string | null;
    hydrated: boolean;
    tokenExpiry: number | null;
    setUserFromToken: (token: string) => void;
    setHydrated: () => void;
    logout: () => void;
    checkTokenExpiry: () => boolean;
    refreshTokenIfNeeded: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
    user: null,
    hydrated: false,
    token: null,
    tokenExpiry: null,

    setUserFromToken: (token: string) => {
        try {
            const payload = jwtDecode<User>(token);

            if (payload.exp && payload.exp * 1000 <= Date.now()) {
                logger.warn('Attempted to set expired token');
                set({ user: null, token: null, tokenExpiry: null });
                return;
            }

            const stored = secureTokenStorage.setToken(token);
            if (!stored) {
                logger.error('Failed to securely store token');
                set({ user: null, token: null, tokenExpiry: null });
                return;
            }

            const expiry = payload.exp ? payload.exp * 1000 : null;
            set({ user: payload, token: token, tokenExpiry: expiry });

            logger.info('User authenticated successfully');
        } catch (err) {
            logger.error('Invalid JWT token during hydration', err);
            set({ user: null, token: null, tokenExpiry: null });
        }
    },

    setHydrated: () => {
        const storedToken = secureTokenStorage.getToken();
        if (storedToken) {
            try {
                const payload = jwtDecode<User>(storedToken);
                const expiry = payload.exp ? payload.exp * 1000 : null;
                set({
                    user: payload,
                    token: storedToken,
                    tokenExpiry: expiry,
                    hydrated: true,
                });
                logger.info('User hydrated from secure storage');
            } catch (err) {
                logger.error('Failed to hydrate user from stored token', err);
                secureTokenStorage.clearToken();
                set({
                    user: null,
                    token: null,
                    tokenExpiry: null,
                    hydrated: true,
                });
            }
        } else {
            set({ hydrated: true });
        }
    },

    logout: () => {
        secureTokenStorage.clearToken();
        set({ user: null, token: null, tokenExpiry: null, hydrated: true });
        logger.info('User logged out successfully');
    },

    checkTokenExpiry: () => {
        const state = get();
        const { tokenExpiry } = state;

        if (!tokenExpiry) return false;

        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000;

        if (now >= tokenExpiry) {
            logger.warn('Token expired, logging out user');
            state.logout();
            return false;
        }

        if (tokenExpiry - now < fiveMinutes) {
            logger.warn('Token expiring soon');
            return false;
        }

        return true;
    },

    refreshTokenIfNeeded: () => {
        const state = get();
        if (secureTokenStorage.isTokenExpiringSoon()) {
            logger.info('Token refresh needed - implement refresh logic here');
            // TODO: Implement token refresh logic
            // This would typically involve calling a refresh endpoint
        }
    },
}));
