export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'failed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  province: string;
  city: string;
  fullAddress: string;
  postalCode: string;
}

export interface OrderItem {
  product: string;
  variantId: string;
  name: string;
  variantLabel?: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  itemsTotal: number;
  shippingCost: number;
  totalAmount: number;
  status: OrderStatus;
  payment: {
    authority?: string;
    refId?: string;
    paidAt?: string;
    note?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderResponse {
  paymentUrl: string;
  orderNumber: string;
}