import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async redirect({url, baseUrl}) {
            if(url.startsWith('/')) return `${baseUrl}${url}`;
            else if(new URL(url).origin === baseUrl) return url;
            return baseUrl;
        },
        authorized({auth, request:{nextUrl} }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/dashboard', nextUrl));
            }
            return true;
        },
    },
    providers: []
} satisfies NextAuthConfig;