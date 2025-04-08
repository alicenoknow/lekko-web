import {
    GetServerSidePropsContext,
    NextApiRequest,
    NextApiResponse,
} from 'next';
import NextAuth, { getServerSession, NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { jwtDecode } from 'jwt-decode';
import { JWT } from 'next-auth/jwt';

const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                if (
                    !credentials ||
                    typeof credentials.email !== 'string' ||
                    typeof credentials.password !== 'string'
                ) {
                    return null;
                }

                const res = await fetch(
                    process.env.NEXT_PUBLIC_SERVER_URL + '/api/v1/login',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    }
                );

                const data = await res.json();
                if (!res.ok || !data.token) return null;

                const decoded = jwtDecode<JWT>(data.token);

                return {
                    id: decoded.sub,
                    username: 'tmp',
                    email: credentials.email,
                    roles: decoded.roles,
                    token: data.token,
                };
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
            console.warn('JWT', user);
            if (user) {
                token.accessToken = user.token;
                token.user = user;
            }
            console.warn('JWT', token);
            return token;
        },
        async session({ session, token }) {
            console.warn('session', token);
            session.token = token;
            return session;
        },
    },
} satisfies NextAuthOptions;

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

export function auth(
    ...args:
        | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
        | [NextApiRequest, NextApiResponse]
        | []
) {
    return getServerSession(...args, authOptions);
}
