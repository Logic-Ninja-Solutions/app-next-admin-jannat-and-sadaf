'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import LoadingAuth from '../components/core/LoadingAuth';
import { isAuthenticated } from '../actions/auth';
import { AuthAction } from '../actions/auth/enum';

export default function Home() {
  const {
    data: authData,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: [AuthAction.auth],
    queryFn: () => isAuthenticated(),
  });

  useEffect(() => {
    if (isSuccess && authData) {
      redirect('/admin');
    }
    if (isSuccess && !authData) {
      redirect('/login');
    }
  }, [isSuccess, authData]);

  if (isLoading) {
    return <LoadingAuth text="authenticating" />;
  }

  return <>Home</>;
}
