'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';
import { User } from '../../types/user';
import serverInstance from '../api';

type Credentials = {
    email: string
    password: string
};

export async function signIn(credentials: Credentials) {
    const parsedCredentials = z
        .object({
            email: z.string().email(),
            password: z.string().min(6),
        })
        .safeParse(credentials);

    if (parsedCredentials.success) {
        const response = await serverInstance.post(
            '/auth/login',
            parsedCredentials.data
        );
        const { data } = response;
        const { token } = data;

        if (!data.isStaff) {
            throw new Error('You are not authorized to access this page.');
        }

        if (token) {
            cookies().set('token', data.token);
        }
    }
}

export async function isAuthenticated() {
    const response = await serverInstance.get<{ user: User }>('auth');
    return response.data;
}

export async function unauthenticate() {
    cookies().delete('token');
}

export async function authenticate(
    prevState: string | undefined | null,
    formData: FormData
) {
    try {
        await signIn({
            email: formData.get('email') as string,
            password: formData.get('password') as string,
        });

        return null;
    } catch (error: any) {
        return error?.message ?? 'Something went wrong.';
    }
}

export async function getUserData(email?: string | null) {
    if (!email) return null;
    const response = await serverInstance.get<{ user: User }>(
        `/user/email/${email}`
    );

    const user = response.data;
    return user;
}
