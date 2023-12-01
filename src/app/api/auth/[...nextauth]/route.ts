import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export interface User {
  id: string;
  name: string;
  email: string;
}

declare module 'next-auth' {
  interface Session {
    user: User;
  }
}

async function getUser(email?: string, password?: string): Promise<User | null> {
  if (email === 'john@example.com' && password === 'password') {
    const user: User = {
      id: '123',
      name: 'John Doe',
      email,
    };
    return Promise.resolve(user);
  }
  return null;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { type: 'text' },
        password: { type: 'password' },
      },

      async authorize(credentials: Record<'email' | 'password', string> | undefined) {
        const email = credentials?.email;
        const password = credentials?.password;

        const user = await getUser(email, password);
        return user;
      },
    }),
  ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
