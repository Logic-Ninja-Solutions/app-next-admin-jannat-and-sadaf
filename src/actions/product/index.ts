'use server';

import { prisma } from '@/server';

export async function deleteProduct(id: string) {
  try {
    const deletedProduct = await prisma.product.delete({
      where: {
        id,
      },
    });

    return deletedProduct;
  } catch {
    return null;
  }
}
