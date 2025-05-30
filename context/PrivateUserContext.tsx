import { User } from '@/types/user';
import { createContext, useContext } from 'react';

interface PrivateUserContextValue {
  user: User;
  token: string;
  logout: () => void;
}

export const PrivateUserContext = createContext<PrivateUserContextValue | null>(null);

export function usePrivateUserContext() {
  const ctx = useContext(PrivateUserContext);
  if (!ctx) {
    throw new Error('usePrivateUserContext must be used inside <PrivateContent>');
  }
  return ctx;
}
