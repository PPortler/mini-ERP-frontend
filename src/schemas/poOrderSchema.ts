import * as yup from "yup";

export const poOrderSchema = yup.object().shape({
  supplier_id: yup
    .string()
    .required("กรุณาเลือก Supplier"),

  status: yup
    .string()
    .required("กรุณาเลือกสถานะ"),
});

export type PoOrderFormValue = yup.InferType<typeof poOrderSchema>;