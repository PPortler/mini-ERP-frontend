import * as yup from "yup";

export const productSchema = yup.object().shape({
  product_code: yup
    .string()
    .required("กรุณากรอกรหัสสินค้า"),

  name: yup
    .string()
    .required("กรุณากรอกชื่อสินค้า"),

  cost_price: yup
    .number()
    .typeError("ราคาทุนต้องเป็นตัวเลข")
    .min(0, "ราคาทุนต้องมากกว่าหรือเท่ากับ 0")
    .required("กรุณากรอกราคาทุน"),

  selling_price: yup
    .number()
    .typeError("ราคาขายต้องเป็นตัวเลข")
    .min(0, "ราคาขายต้องมากกว่าหรือเท่ากับ 0")
    .required("กรุณากรอกราคาขาย"),

  unit: yup
    .string()
    .required("กรุณากรอกหน่วยสินค้า"),

  min_stock: yup
    .number()
    .typeError("ขั้นต่ำสต็อกต้องเป็นตัวเลข")
    .min(0, "ขั้นต่ำสต็อกต้องมากกว่าหรือเท่ากับ 0")
    .required("กรุณากรอกจำนวนขั้นต่ำ"),

  // category_id: yup
  //   .string()
  //   .uuid("รูปแบบหมวดหมู่ไม่ถูกต้อง")
  //   .required("กรุณาเลือกหมวดหมู่สินค้า"),

  stock: yup
    .number()
    .typeError("จำนวนสต็อกต้องเป็นตัวเลข")
    .min(0, "จำนวนสต็อกต้องมากกว่าหรือเท่ากับ 0")
    .optional(),
});

export type ProductFormValue = yup.InferType<typeof productSchema>;