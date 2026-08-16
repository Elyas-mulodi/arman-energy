export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent: string | null;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}