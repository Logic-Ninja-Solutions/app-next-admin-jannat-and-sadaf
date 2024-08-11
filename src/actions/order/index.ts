'use server';

import serverInstance from '../api';
import { OrderStatus } from './enums';
import { Order, SingleOrder } from '../../types/order';

// --------

export async function getOrder(orderID?: string) {
  const response = await serverInstance.get<SingleOrder>(`order/${orderID}`);
  const order = response.data;
  return order;
}

export async function updateStatus(id: string, status: OrderStatus) {
  const response = await serverInstance.patch<Order>(`order/${id}`, {
    status,
  });
  return response.data;
}
