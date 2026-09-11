import { NextResponse } from 'next/server';

const PROTECTED_ROUTES = ['/checkout', '/profile'];

export function proxy(request) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('jwt')?.value || null;

    // /admin pe login AdminShell handle karega — yahan redirect mat karo
    // sirf website protected routes
    if (PROTECTED_ROUTES.includes(pathname) && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/checkout',
        '/profile',
        '/login',
        '/register',
        '/verify-otp',
        '/admin',
        '/admin/:path*',
    ],
};
