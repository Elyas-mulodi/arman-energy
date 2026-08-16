export type UserRole = 'user' | 'admin';

export interface UserAddress {
  province?: string;
  city?: string;
  fullAddress?: string;
  postalCode?: string;
}

export interface User {
  _id: string;
  fullName: string;
  phone: string;
  email?: string;
  role: UserRole;
  address?: UserAddress;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}