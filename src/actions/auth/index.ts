'use server';

import { AuthError } from 'next-auth';
import { auth, signIn, signOut } from '@/src/auth';
import { prisma } from '@/server';

export async function isAuthenticated() {
  const data = await auth();
  return data;
}

export async function getUserData(email?: string | null) {
  if (!email) return null;
  const user = await prisma.user.findUnique({
    where: { email },
    include: { addresses: true },
  });
  return user;
}

export async function unauthenticate() {
  await signOut();
}

export async function authenticate(prevState: string | undefined, formData: FormData) {
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
