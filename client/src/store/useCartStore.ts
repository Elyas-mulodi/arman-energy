import { create } from 'zustand';
import api from '@/lib/axios';
import { Cart, CartItem } from '@/types/cart';

interface CartState {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  isLoading: boolean;
  isInitialized: boolean;

  fetchCart: () => Promise<void>;
  addToCart: (productId: string, variantId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const applyCart = (data: Cart) => ({
  items: data.items,
  subtotal: data.subtotal,
  itemCount: data.itemCount,
});

export const useCartStore = create<CartState>((set) => ({
  items: [],
  subtotal: 0,
  itemCount: 0,
  isLoading: false,
  isInitialized: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get<Cart>('/cart', {
        headers: { 'x-skip-auth-redirect': 'true' },
      });
      set({ ...applyCart(data), isLoading: false, isInitialized: true });
    } catch {
      set({ isLoading: false, isInitialized: true });
    }
  },

  addToCart: async (productId, variantId, quantity = 1) => {
    const { data } = await api.post<Cart>('/cart', { productId, variantId, quantity });
    set(applyCart(data));
  },

  updateQuantity: async (itemId, quantity) => {
    const { data } = await api.put<Cart>(`/cart/${itemId}`, { quantity });
    set(applyCart(data));
  },

  removeItem: async (itemId) => {
    const { data } = await api.delete<Cart>(`/cart/${itemId}`);
    set(applyCart(data));
  },

  clearCart: async () => {
    await api.delete('/cart');
    set({ items: [], subtotal: 0, itemCount: 0 });
  },
}));