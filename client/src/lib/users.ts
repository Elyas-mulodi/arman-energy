import api from '@/lib/axios';
import { User } from '@/types/user';

export async function getAllUsersAdmin(): Promise<User[]> {
  const { data } = await api.get<User[]>('/users');
  return data;
}

export async function toggleUserStatusAdmin(userId: string): Promise<{ isActive: boolean }> {
  const { data } = await api.put<{ message: string; isActive: boolean }>(
    `/users/${userId}/toggle-status`
  );
  return data;
}