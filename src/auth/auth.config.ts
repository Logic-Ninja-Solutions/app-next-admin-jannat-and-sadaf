import type { NextAuthConfig } from 'next-auth';
import { NextURL } from 'next/dist/server/web/next-url';

const authenticatedRoutes = ['/admin'];
const userRoutes = ['/login', '/signup'];

function isInRoutes(url: NextURL, routes: string[]) {
  return routes.some((route) => url.pathname.startsWith(route));
}

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      if (isInRoutes(nextUrl, authenticatedRoutes)) {
        if (isLoggedIn) return true;
        return false;
      }

      const url = new URL(nextUrl);
      const callbackURL = url.searchParams.get('callbackUrl');
      if (callbackURL && isLoggedIn) {
        return Response.redirect(new URL(callbackURL));
      }

      if (isInRoutes(nextUrl, userRoutes)) {
        if (isLoggedIn) return Response.redirect(url.origin);
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
