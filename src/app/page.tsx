'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import LoadingAuth from '../components/core/LoadingAuth';

export default function Home() {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    },
  });

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

  return <></>;
}
