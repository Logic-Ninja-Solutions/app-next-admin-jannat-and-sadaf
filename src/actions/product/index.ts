'use server';

import { prisma } from '@/server';
import { hardCodedProducts } from './hardCodedProducts';

// --------

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

export async function createSample() {
  try {
    const createdProducts = await prisma.product.createMany({
      data: hardCodedProducts,
    });

    return createdProducts;
  } catch {
    return null;
  }
}
