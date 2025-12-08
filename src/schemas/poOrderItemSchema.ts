import * as yup from "yup";

export const poOrderItemsSchemaAdd = yup.object({
  product_id: yup.string().required("กรุณาเลือก Product"),

  quantity: yup
    .number()
    .required("กรุณาใส่จำนวน")
    .min(1, "จำนวนต้องไม่น้อยกว่า 1"),
  
});

export const poOrderItemsSchemaEdit = yup.object({
  product_id: yup.string().required("กรุณาเลือก Product"),

  quantity: yup
    .number()
    .required("กรุณาใส่จำนวน")
    .min(1, "จำนวนต้องไม่น้อยกว่า 1"),

  price: yup
    .number()
    .required("กรุณาใส่ราคา")
    .min(0, "ราคาต้องไม่น้อยกว่า 0"),
});