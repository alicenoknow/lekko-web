import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import { User } from '@/types/user';
import { logger } from '@/lib/logger';
import { secureTokenStorage } from '@/lib/security/tokenStorage';
import { refreshAccessToken } from '@/lib/api/auth';

interface UserStore {
    user: User | null;
    token: string | null;
    hydrated: boolean;
    tokenExpiry: number | null;
    isRefreshing: boolean;
    setUserFromToken: (accessToken: string, refreshToken?: string) => Promise<boolean>;
    setHydrated: () => Promise<void>;
    logout: () => void;
    checkTokenExpiry: () => boolean;
    refreshTokenIfNeeded: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
    user: null,
    hydrated: false,
    token: null,
    tokenExpiry: null,
    isRefreshing: false,

    setUserFromToken: async (accessToken: string, refreshToken?: string) => {
        try {
            const payload = jwtDecode<User>(accessToken);

            if (payload.exp && payload.exp * 1000 <= Date.now()) {
                logger.warn('Attempted to set expired token');
                set({ user: null, token: null, tokenExpiry: null });
                return false;
            }

            const stored = await secureTokenStorage.setToken(accessToken);
            if (!stored) {
                logger.error('Failed to securely store token');
                set({ user: null, token: null, tokenExpiry: null });
                return false;
            }

            if (refreshToken) {
                await secureTokenStorage.setRefreshToken(refreshToken);
            }

            const expiry = payload.exp ? payload.exp * 1000 : null;
            set({ user: payload, token: accessToken, tokenExpiry: expiry });

            logger.info('User authenticated successfully');
            return true;
        } catch (err) {
            logger.error('Invalid JWT token during hydration', err);
            set({ user: null, token: null, tokenExpiry: null });
            return false;
        }
    },

    setHydrated: async () => {
        const storedToken = await secureTokenStorage.getToken();
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

    refreshTokenIfNeeded: async () => {
        const state = get();

        if (!state.token || state.isRefreshing) return;
        if (!secureTokenStorage.isTokenAtHalfLife()) return;

        const storedRefreshToken = await secureTokenStorage.getRefreshToken();
        if (!storedRefreshToken) {
            logger.warn('No refresh token available for refresh');
            return;
        }

        set({ isRefreshing: true });
        try {
            logger.info('Refreshing token at half-life point');
            const data = await refreshAccessToken(storedRefreshToken);
            await get().setUserFromToken(data.access_token, data.refresh_token);
            logger.info('Token refreshed successfully');
        } catch (error) {
            logger.error('Failed to refresh token, logging out', error);
            get().logout();
        } finally {
            set({ isRefreshing: false });
        }
    },
}));
