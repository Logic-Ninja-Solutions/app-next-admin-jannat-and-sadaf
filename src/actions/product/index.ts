'use server';

import serverInstance from '../api';

export async function deleteProduct(id: string) {
    try {
        const response = await serverInstance.delete(`product/${id}`);
        return response.data;
    } catch {
        return null;
    }
}
