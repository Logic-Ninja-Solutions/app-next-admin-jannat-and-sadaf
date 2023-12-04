'use server';

import { prisma } from '@/server';
import { OrderStatus } from './enums';

// --------

export async function getOrder(orderID: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderID },
    include: {
      address: true,
      User: true,
    },
  });
  return order;
}

export async function updateStatus(id: string, status: OrderStatus) {
  const order = await prisma.order.update({
    where: { id },
    data: { status },
  });
  return order;
}
