'use client';

import { useQuery } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { isAuthenticated } from '@/src/actions/auth';
import { AuthAction } from '@/src/actions/auth/enum';
import LoadingAuth from '@/src/components/core/LoadingAuth';
import DefaultLayout from '@/src/components/layouts/DefaultLayout';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const {
    data: authData,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: [AuthAction.auth],
    queryFn: () => isAuthenticated(),
  });

  if (isLoading) {
    return <LoadingAuth text="authenticating" />;
  }

  return <DefaultLayout>{children}</DefaultLayout>;
}

RootLayout.requireAuth = true;
