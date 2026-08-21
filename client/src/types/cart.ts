interface CartItemBase {
  _id: string;
}

export interface UnavailableCartItem extends CartItemBase {
  available: false;
  message: string;
  product?: { name: string; slug: string };
}

export interface AvailableCartItem extends CartItemBase {
  available: true;
  product: {
    _id: string;
    name: string;
    slug: string;
    image: string | null;
  };
  variant: {
    _id: string;
    voltage?: string;
    size?: string;
    brand?: string;
    price: number;
    discountPrice?: number | null;
    stock: number;
  };
  quantity: number;
  lineTotal: number;
  stockWarning: string | null;
}

export type CartItem = AvailableCartItem | UnavailableCartItem;

export interface Cart {
  _id: string;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}