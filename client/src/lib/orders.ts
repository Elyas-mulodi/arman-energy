import api from '@/lib/axios';
import { Order, OrderListResponse } from '@/types/order';

export async function getMyOrders(): Promise<Order[]> {
  const { data } = await api.get<Order[]>('/orders/my');
  return data;
}

export async function getOrderByNumber(orderNumber: string): Promise<Order> {
  const { data } = await api.get<Order>(`/orders/${orderNumber}`);
  return data;
}

export async function getAllOrdersAdmin(params: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<OrderListResponse> {
  const { data } = await api.get<OrderListResponse>('/orders', { params });
  return data;
}

export async function updateOrderStatusAdmin(orderId: string, status: string): Promise<Order> {
  const { data } = await api.put<Order>(`/orders/${orderId}/status`, { status });
  return data;
}