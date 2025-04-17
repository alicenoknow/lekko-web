import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import { User } from '@/types/User';

interface UserStore {
  user: User | null;
  token: string | null;
  hydrated: boolean;
  setUserFromToken: (token: string) => void;
  setHydrated: () => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  hydrated: false,
  token: null,
  setUserFromToken: (token: string) => {
    try {
      const payload = jwtDecode<User>(token);
      set({ user: payload, token: token });
      localStorage.setItem('token', token);
    } catch (err) {
      console.error('Invalid JWT token');
      set({ user: null });
    }
  },
  setHydrated: () => set({ hydrated: true }),
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, hydrated: true, token: null });
  },
}));
