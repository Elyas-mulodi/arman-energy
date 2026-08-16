import { create } from 'zustand';
import api from '@/lib/axios';
import { Cart, CartItem } from '@/types/cart';

interface CartState {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  isLoading: boolean;

  fetchCart: () => Promise<void>;
  addToCart: (productId: string, variantId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  subtotal: 0,
  itemCount: 0,
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get<Cart>('/cart');
      set({ items: data.items, subtotal: data.subtotal, itemCount: data.itemCount, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addToCart: async (productId, variantId, quantity = 1) => {
    const { data } = await api.post<Cart>('/cart', { productId, variantId, quantity });
    set({ items: data.items, subtotal: data.subtotal, itemCount: data.itemCount });
  },

  updateQuantity: async (itemId, quantity) => {
    const { data } = await api.put<Cart>(`/cart/${itemId}`, { quantity });
    set({ items: data.items, subtotal: data.subtotal, itemCount: data.itemCount });
  },

  removeItem: async (itemId) => {
    const { data } = await api.delete<Cart>(`/cart/${itemId}`);
    set({ items: data.items, subtotal: data.subtotal, itemCount: data.itemCount });
  },

  clearCart: async () => {
    await api.delete('/cart');
    set({ items: [], subtotal: 0, itemCount: 0 });
  },
}));