import { User } from "@/types/User";

export function isAdmin(user: User): boolean {
    return user?.roles?.includes('admin');
}