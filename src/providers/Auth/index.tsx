'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

import LoadingAuth from '@/src/components/core/LoadingAuth';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    },
  });

  if (status === 'loading') {
    return <LoadingAuth text="Authenticating..." />;
  }

  return <>{children}</>;
}
