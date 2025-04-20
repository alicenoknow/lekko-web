import { User } from '@/types/user';

export function isAdmin(user: User): boolean {
    return user?.roles?.includes('admin');
}
