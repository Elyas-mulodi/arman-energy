import { Category } from '@/types/category';

export interface CategoryWithChildren extends Category {
  children: Category[];
}

export function buildCategoryTree(categories: Category[]): CategoryWithChildren[] {
  const roots = categories
    .filter((c) => !c.parent)
    .sort((a, b) => a.order - b.order);

  return roots.map((root) => ({
    ...root,
    children: categories
      .filter((c) => c.parent === root._id)
      .sort((a, b) => a.order - b.order),
  }));
}