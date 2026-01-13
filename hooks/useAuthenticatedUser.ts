import { useUserStore } from '@/store/user';
import { User } from '@/types/user';

/**
 * Custom hook that ensures we have an authenticated user.
 * This should only be used in components that are wrapped with PrivateContent
 * or are otherwise guaranteed to have an authenticated user.
 *
 * @throws Error if user or token is null
 * @returns Authenticated user data and token
 */
export function useAuthenticatedUser(): {
    user: User;
    token: string;
    logout: () => void;
} {
    const { user, token, logout } = useUserStore();

    if (!user || !token) {
        throw new Error(
            'useAuthenticatedUser must be used within components that guarantee authentication (e.g., wrapped with PrivateContent)'
        );
    }

    return { user, token, logout };
}

