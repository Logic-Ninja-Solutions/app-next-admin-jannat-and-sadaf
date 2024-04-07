'use server';

import serverInstance from '../api';
import { OrderStatus } from './enums';
import { Order } from '../../types/order';

// --------

export async function getOrder(orderID?: string) {
  const response = await serverInstance.get<Order>(`order/${orderID}`);
  return response.data;
}

export async function updateStatus(id: string, status: OrderStatus) {
  const response = await serverInstance.patch<Order>(`order/${id}`, {
    status,
  });
  return response.data;
}
