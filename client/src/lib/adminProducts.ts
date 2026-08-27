import api from '@/lib/axios';
import { Product } from '@/types/product';

export async function getProducts(): Promise<Product[]> {
  const { data } = await api.get<Product[]>('/products/admin');
  return data;
}

export async function getProductById(id: string): Promise<Product> {
  const { data } = await api.get<Product>(`/products/admin/${id}`);
  return data;
}

const multipartConfig = { headers: { 'Content-Type': undefined } };

export async function createProduct(formData: FormData): Promise<Product> {
  const { data } = await api.post<Product>('/products', formData, multipartConfig);
  return data;
}

export async function updateProduct(id: string, formData: FormData): Promise<Product> {
  const { data } = await api.put<Product>(`/products/${id}`, formData, multipartConfig);
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/products/${id}`);
}

export async function deleteProductImage(id: string, imageUrl: string): Promise<{ images: string[] }> {
  const { data } = await api.delete<{ images: string[] }>(`/products/${id}/image`, {
    data: { imageUrl },
  });
  return data;
}

export async function toggleProductActive(id: string, isActive: boolean): Promise<Product> {
  const formData = new FormData();
  formData.append('isActive', String(isActive));
  const { data } = await api.put<Product>(`/products/${id}`, formData, multipartConfig);
  return data;
}