import { useEffect } from 'react';
import { useUserStore } from '@/store/user';
import { logger } from '@/lib/logger';

/**
 * Hook to monitor token expiry and handle automatic logout
 * Runs periodic checks to ensure token is still valid
 */
export function useTokenMonitor() {
    const { checkTokenExpiry, refreshTokenIfNeeded, user } = useUserStore();

    useEffect(() => {
        if (!user) return;

        // Check token expiry every 5 minutes
        const interval = setInterval(() => {
            const isValid = checkTokenExpiry();
            if (!isValid) {
                logger.warn('Token validation failed, user will be logged out');
            } else {
                refreshTokenIfNeeded();
            }
        }, 5 * 60 * 1000);

        const handleVisibilityChange = () => {
            if (!document.hidden) {
                checkTokenExpiry();
                refreshTokenIfNeeded();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(interval);
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange
            );
        };
    }, [user, checkTokenExpiry, refreshTokenIfNeeded]);
}

