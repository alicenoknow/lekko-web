import NextAuth, { User, type DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        token: JWT;
    }
    interface User {
        id: number;
        email: string;
        roles: string[];
        token: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        sub: number;
        roles: string[];
        exp: number;
    }
}
