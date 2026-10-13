import api from '@/lib/axios';
import { Order, OrderListResponse, OrderStatus } from '@/types/order';

export async function getMyOrders(): Promise<Order[]> {
  const { data } = await api.get<Order[]>('/orders/my');
  return data;
}

export async function getOrderByNumber(orderNumber: string): Promise<Order> {
  const { data } = await api.get<Order>(`/orders/${orderNumber}`);
  return data;
}

export async function getAllOrdersAdmin(
  params: { status?: string; search?: string; page?: number; limit?: number },
  signal?: AbortSignal
): Promise<OrderListResponse> {
  const { data } = await api.get<OrderListResponse>('/orders', { params, signal });
  return data;
}

export async function updateOrderStatusAdmin(orderId: string, status: OrderStatus): Promise<Order> {
  const { data } = await api.put<Order>(`/orders/${orderId}/status`, { status });
  return data;
}