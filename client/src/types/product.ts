export interface ProductVariant {
  _id: string;
  voltage?: string;
  size?: string;
  brand?: string;
  sku: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
  isActive: boolean;
}

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  category: string | { _id: string; name: string; slug: string };
  images: string[];
  variants: ProductVariant[];
  specifications: ProductSpecification[];
  isActive: boolean;
  isFeatured: boolean;
  viewCount: number;
  totalStock?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponse {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

export interface VariantFormValue {
  _id?: string; 
  voltage: string;
  size: string;
  brand: string;
  sku: string;
  price: string;
  discountPrice: string;
  stock: string;
  isActive: boolean;
}

export interface SpecFormValue {
  key: string;
  value: string;
}