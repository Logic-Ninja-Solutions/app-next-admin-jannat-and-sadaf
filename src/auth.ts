import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import serverInstance from './actions/api';
import { authConfig } from './auth/auth.config';

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    trustHost: true,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({
                        email: z.string().email(),
                        password: z.string().min(6),
                    })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const response = await serverInstance.post('auth/login', {
                        email,
                        password,
                    });
                    return response.data;
                }

                return null;
            },
        }),
    ],
});
