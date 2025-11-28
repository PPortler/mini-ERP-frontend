export const columnMinStock = [
  { header: "สินค้า", accessor: "name" },
  { header: "หน่วย", accessor: "unit" },
  { header: "ราคาทุน", accessor: "cost_price" },
  { header: "ราคาขาย", accessor: "selling_price" },
  // { header: "หมวดหมู่", accessor: "category_name" },
  { header: "Min Stock", accessor: "min_stock" },
];

export const receivingColumns = [
  { header: "เดือน", accessor: "month" },
  { header: "จำนวนรายการรับสินค้า", accessor: "received_count" },
  { header: "ยอดรวมมูลค่า", accessor: "total_amount" },
];

export const withdrawColumns = [
  { header: "วันที่", accessor: "date" },
  { header: "ผู้เบิก", accessor: "created_by" },
  { header: "สินค้า", accessor: "item" },
  { header: "จำนวน", accessor: "quantity" },
];

export const poColumns = [
  { header: "PO No.", accessor: "po_number" },
  { header: "Vendor", accessor: "vendor" },
  { header: "Total", accessor: "total_amount" },
];

export const columnStock = [
  {
    header: "รหัสสินค้า",
    accessor: "product_id",
  },
  {
    header: "ประเภท",
    accessor: "type",
  },
  {
    header: "จำนวน",
    accessor: "quantity",
  },
  {
    header: "เหตุผล",
    accessor: "reason",
  },
  {
    header: "เอกสารอ้างอิง",
    accessor: "reference",
  },
  {
    header: "วันที่ทำรายการ",
    accessor: "created_at",
  }
];

export const columnSupplier = [
  { header: "ชื่อ", accessor: "name" },
  { header: "เบอร์โทร", accessor: "phone" },
  { header: "อีเมล", accessor: "email" },
  { header: "ที่อยู่", accessor: "address" },
];