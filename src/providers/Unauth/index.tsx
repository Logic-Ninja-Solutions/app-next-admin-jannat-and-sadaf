'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

import LoadingAuth from '@/src/components/core/LoadingAuth';

export default function UnAuthProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();

  useEffect(() => {
    if (status === 'loading') {
      return;
    }
    if (status === 'authenticated') {
      redirect('/admin');
    }
  }, [status]);

  if (status === 'loading') {
    return <LoadingAuth text="authenticating" />;
  }

  return <>{children}</>;
}
