import type { ProductType } from "../types/product";
import type { ProductResponse } from "../types/apiResponse";
import { mockCatagories } from "./mockCatagories";


// ฟังก์ชันช่วยหา category ตาม id
const findCategory = (id: string) =>
  mockCatagories.find(c => c.category_id === id) || null;

export const getMockProductsByIds = (product_ids: string[]): ProductType[] => {
  return mockProducts.filter(p => product_ids.includes(p.product_id));
};

export const getMockProductById = (product_id: string): ProductType | undefined => {
  return mockProducts.find(p => p.product_id === product_id);
};

export const mockProducts: ProductType[] = [
  {
    product_code: "S006",
    product_id: "1a2b3c4d-0001",
    name: "กาวร้อน 12ml",
    cost_price: 15,
    selling_price: 25,
    min_stock: 10,
    unit: "Ozn",
    category_id: "9",
    category: findCategory("9"),
    product_image_url: "https://your-storage.com/images/superglue-12ml.png"
  },
  {
    product_code: "S005",
    product_id: "1a2b3c4d-0002",
    name: "เครื่องเขียน A4",
    cost_price: 5,
    selling_price: 10,
    min_stock: 20,
    unit: "Ozn",
    category_id: "9",
    category: findCategory("9"),
    product_image_url: "https://your-storage.com/images/superglue-12ml.png"
  },
  {
    product_code: "S004",
    product_id: "1a2b3c4d-0003",
    name: "น้ำเปล่า",
    cost_price: 20,
    selling_price: 35,
    min_stock: 10,
    unit: "Ozn",
    category_id: "3",
    category: findCategory("3"),
    product_image_url: "https://your-storage.com/images/superglue-12ml.png"
  },
  {
    product_code: "S003",
    product_id: "1a2b3c4d-0004",
    name: "น้ำหวาน",
    cost_price: 2,
    selling_price: 5,
    min_stock: 10,
    unit: "Ozn",
    category_id: "3",
    category: findCategory("3"),
    product_image_url: "https://your-storage.com/images/superglue-12ml.png"
  },
  {
    product_code: "S002",
    product_id: "1a2b3c4d-0005",
    name: "มะม่วง",
    cost_price: 10,
    selling_price: 18,
    min_stock: 12,
    unit: "Ozn",
    category_id: "1",
    category: findCategory("1"),
    product_image_url: "https://your-storage.com/images/superglue-12ml.png"
  },
  {
    product_code: "S001",
    product_id: "1a2b3c4d-0006",
    name: "มาม่า",
    cost_price: 8,
    selling_price: 15,
    min_stock: 10,
    unit: "Ozn",
    category_id: "5",
    category: findCategory("5"),
    product_image_url: "https://your-storage.com/images/superglue-12ml.png"
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