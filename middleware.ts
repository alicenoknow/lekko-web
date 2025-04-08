import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(function middleware(req) {
    if (!req.nextauth.token) {
        const url = req.nextUrl.clone();
        url.pathname = '/user/login';
        return NextResponse.rewrite(url);
    }
    return NextResponse.next();
});

export const config = {
    matcher: ['/typer'],
};
