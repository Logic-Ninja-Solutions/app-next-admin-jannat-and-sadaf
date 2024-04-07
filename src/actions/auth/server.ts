'use server';

import { cookies } from 'next/headers';

export async function getAccessToken() {
    return cookies().get('token')?.value;
}
