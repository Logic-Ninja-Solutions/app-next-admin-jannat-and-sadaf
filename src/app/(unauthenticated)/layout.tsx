'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { GetAuth } from '../../api/user';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data, isSuccess, isLoading, isError } = GetAuth();
      const router = useRouter();

      useEffect(() => {
        if (isLoading) return;
        if (isError) return;

        if (isSuccess && data.user.isStaff) {
            router.replace('/admin');
        }
      }, [isSuccess, isLoading, isError, data]);

    return <>{children}</>;
}

RootLayout.requireAuth = true;
