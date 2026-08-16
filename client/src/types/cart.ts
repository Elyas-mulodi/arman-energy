export interface CartItemVariant {
  _id: string;
  voltage?: string;
  size?: string;
  brand?: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
}

export interface CartItemProduct {
  _id: string;
  name: string;
  slug: string;
  image: string | null;
}

export interface CartItem {
  _id: string;
  product?: CartItemProduct;
  variant?: CartItemVariant;
  quantity: number;
  lineTotal?: number;
  available: boolean;
  message?: string;
  stockWarning?: string | null;
}

export interface Cart {
  _id: string;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}