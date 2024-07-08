import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async redirect({url, baseUrl}) {
            if(url.startsWith('/')) return `${baseUrl}${url}`;
            else if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        },
        async session({session, user}) {
            if(session && user) {
                session.user = user;
            }
            return session;
        }
    },
    providers: []
} satisfies NextAuthConfig;