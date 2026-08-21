import api from '@/lib/axios';
import { Order } from '@/types/order';

export async function getMyOrders(): Promise<Order[]> {
  const { data } = await api.get<Order[]>('/orders/my-orders');
  return data;
}