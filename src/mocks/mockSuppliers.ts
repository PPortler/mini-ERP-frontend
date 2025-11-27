import type { SupplierType } from "../types/suppliers";

export const mockSuppliers: SupplierType[] = [
  {
    supplier_id: "SUP001",
    name: "บริษัท สมายล์ฟู้ด จำกัด",
    phone: "0812345678",
    email: "contact@smilefood.co.th",
    address: "123 ถนนสุขสวัสดิ์ กรุงเทพฯ",
    create_at: "2025-01-10T10:20:30Z",
  },
  {
    supplier_id: "SUP002",
    name: "หจก. ฟาร์มสดดี",
    phone: "0891122334",
    email: "freshfarm@gmail.com",
    address: "45/7 ตำบลท่าศาลา อำเภอเมือง เชียงใหม่",
    create_at: "2025-01-12T11:00:00Z",
  },
  {
    supplier_id: "SUP003",
    name: "Green Market Supply",
    phone: "0805552233",
    email: "support@greenmarket.com",
    address: "89/3 ถ.ประชาร่วมใจ กรุงเทพฯ",
    create_at: "2025-01-15T14:45:10Z",
  },
  {
    supplier_id: "SUP004",
    name: "Premium Ingredient Co., Ltd.",
    email: "info@premium-ing.com",
    address: "22/8 ถ.สุขุมวิท พัทยา",
    create_at: "2025-02-02T09:30:00Z",
  },
  {
    supplier_id: "SUP005",
    name: "Thai Fresh Food",
    phone: "0867778899",
    address: "99/12 อ.เมือง ขอนแก่น",
    create_at: "2025-02-05T13:20:40Z",
  }
];