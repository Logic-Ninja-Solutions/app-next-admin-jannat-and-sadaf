'use server';

import { AuthError } from 'next-auth';
import { auth, signIn, signOut } from '@/src/auth';
import serverInstance from '../api';

export async function isAuthenticated() {
    const data = await auth();
    return data;
}

export async function getUserData(email?: string | null) {
    if (!email) return null;

    const response = await serverInstance.get(`/user/email/${email}`);
    return response.data;
}

export async function unauthenticate() {
    await signOut();
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        const data = await signIn('credentials', formData);
        return data;
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}
