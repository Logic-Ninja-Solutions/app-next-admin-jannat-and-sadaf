'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DefaultLayout from '@/src/components/layouts/DefaultLayout';
import { GetAuth } from '../../api/user';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isLoading, isError, isSuccess } = GetAuth();

  const router = useRouter();

  useEffect(() => {
    if (isSuccess) return;
    if (isLoading) return;

    if (isError) {
      router.replace('/login');
    }
    if (!data?.user) return;

    if (!data.user?.isStaff) {
      router.replace('/login');
    }
  }, [isLoading, isError, data]);

  return (
    <>

      <DefaultLayout>{children}</DefaultLayout>

    </>
  );
}

RootLayout.requireAuth = true;
