import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

interface User {
  sub: number;
  roles: string[];
  exp: number;
}

interface UserStore {
  user: User | null;
  hydrated: boolean;
  setUserFromToken: (token: string) => void;
  setHydrated: () => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  hydrated: false,

  setUserFromToken: (token: string) => {
    try {
      const payload = jwtDecode<User>(token);
      set({ user: payload });
    } catch (err) {
      console.error('Invalid JWT token');
      set({ user: null });
    }
  },

  setHydrated: () => set({ hydrated: true }),

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, hydrated: true });
  },
}));
