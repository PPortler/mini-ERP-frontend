import * as yup from "yup";

export const supplierSchema = yup.object().shape({
  name: yup.string().required("กรุณากรอกชื่อ Supplier"),
  phone: yup
    .string()
    .required("กรุณากรอกเบอร์โทร")
    .matches(/^\d+$/, "เบอร์โทรต้องเป็นตัวเลขเท่านั้น"),
  email: yup.string().email("อีเมลไม่ถูกต้อง").nullable().required("กรุณากรอกอีเมล"),
  address: yup.string().nullable().required("กรุณากรอกที่อยู่"),
});

export type SupplierFormValue = yup.InferType<typeof supplierSchema>;