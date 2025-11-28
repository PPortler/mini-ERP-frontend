import type { ProductType } from "../types/product";
import type { ProductResponse } from "../types/apiResponse";

export const mockProducts: ProductType[] = [
  {
    product_id: "1a2b3c4d-0001",
    name: "กาวร้อน 12ml",
    cost_price: 15,
    selling_price: 25,
    min_stock: 10,
    unit: 1,
    category_id: "9",
  },
  {
    product_id: "1a2b3c4d-0002",
    name: "เครื่องเขียน A4",
    cost_price: 5,
    selling_price: 10,
    min_stock: 20,
    unit: 1,
    category_id: "9",
  },
  {
    product_id: "1a2b3c4d-0003",
    name: "น้ำเปล่า",
    cost_price: 20,
    selling_price: 35,
    min_stock: 10,
    unit: 1,
    category_id: "3",
  },
  {
    product_id: "1a2b3c4d-0004",
    name: "น้ำหวาน",
    cost_price: 2,
    selling_price: 5,
    min_stock: 10,
    unit: 1,
    category_id: "3",
  },
  {
    product_id: "1a2b3c4d-0005",
    name: "มะม่วง",
    cost_price: 10,
    selling_price: 18,
    min_stock: 12,
    unit: 1,
    category_id: "1",
  },
  {
    product_id: "1a2b3c4d-0006",
    name: "มาม่า",
    cost_price: 8,
    selling_price: 15,
    min_stock: 10,
    unit: 1,
    category_id: "5",
  },
];

export const getMockProducts = (
  page = 1,
  pageSize = 10,
  search: string = "",
  categpry_id?: string
): ProductResponse => {
  let filtered = [...mockProducts];

  // filter by search keyword
  if (search.trim()) {
    const lowerSearch = search.toLowerCase();
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(lowerSearch));
  }

  // filter by category_id
  if (categpry_id) {
    filtered = filtered.filter((p) => p.category_id === categpry_id);
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const products = filtered.slice(start, end);

  return { data: products, total, page, pageSize, totalPages };
};