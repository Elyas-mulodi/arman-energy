export interface VariantDraft {
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

export interface SpecDraft {
  key: string;
  value: string;
}

export const emptyVariant: VariantDraft = {
  voltage: '',
  size: '',
  brand: '',
  sku: '',
  price: '',
  discountPrice: '',
  stock: '',
  isActive: true,
};