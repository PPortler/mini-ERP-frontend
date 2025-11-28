import type { ProductType } from "../types/product";
import type { CatagoriesType } from "../types/catagories";

export const mapProductsWithCategory = (
  products: ProductType[],
  categories: CatagoriesType[]
): ProductType[] => {
  return products.map((p) => {
    const category = categories.find(
      (c) => c.category_id === p.category_id
    );
    return {
      ...p,
      category_name: category?.name ?? "-",
    };
  });
};