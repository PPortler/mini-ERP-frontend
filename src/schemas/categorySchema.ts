import * as yup from "yup";

export const categorySchema = yup.object().shape({
  name: yup.string().required("กรุณากรอกชื่อหมวดหมู่"),
  description: yup.string().required("กรุณากรอกรายละเอียด"),
});

export type CategoryFormValue = yup.InferType<typeof categorySchema>;