'use client';

import { jwtDecode } from 'jwt-decode';
import React, { createContext, useState, useEffect } from 'react';

type Token = string | null;
type Role = 'Admin' | 'User';

interface AuthContextProps {
    token: Token;
    setToken: (token: Token) => void;
    loading: boolean;
    roles: readonly Role[];
    username: string;
    setUsername: (username: string) => void;
}

interface JwtPayload {
    sub: string;
    exp: number;
    roles: readonly Role[];
}

export const AuthContext = createContext<AuthContextProps>({
    token: null,
    setToken: () => {},
    roles: [],
    loading: false,
    username: '',
    setUsername: () => {},
});

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
    const [token, setToken] = useState<Token>(null);
    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState<readonly Role[]>([]);
    const [username, setUsername] = useState<string>('');

    const setTokenData = (token: Token) => {
        if (token) {
            try {
                setToken(token);
                const decodedToken: JwtPayload = jwtDecode<JwtPayload>(token);
                setRoles(decodedToken.roles);
            } catch (error) {
                console.error('Invalid token provided:', error);
                setToken(null);
                setRoles([]);
            }
        } else {
            setRoles([]);
            setToken(null);
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        storedToken && setTokenData(storedToken);
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                token,
                setToken: setTokenData,
                roles,
                loading,
                username,
                setUsername,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
