'use client';

import { useQuery } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { isAuthenticated } from '../actions/auth';
import { AuthAction } from '../actions/auth/enum';
import LoadingAuth from '../components/core/LoadingAuth';

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
        return <LoadingAuth text="Authenticating" />;
    }

    return <>Home</>;
}
