import * as yup from "yup";
import { TYPE_STOCK_TRANSECTION } from "../constants/enum/enum";

export const stockTransactionSchema = yup.object().shape({
    product_id: yup
        .string()
        .uuid("รูปแบบไม่ถูกต้อง")
        .required("กรุณาเลือกสินค้า"),
    quantity: yup
        .number()
        .min(0, "จำนวนต้องมากกว่า 0")
        .required("กรุณาระบุจำนวน"),
    type: yup
        .string()
        .required(),
    reason: yup
        .string()
        .nullable()
        .required("กรุณาใส่เหตุผล")
        .when("type", {
            is: TYPE_STOCK_TRANSECTION.ADJUST,
            then: (schema) => schema.required("กรุณาใส่เหตุผล"),
            otherwise: (schema) => schema.notRequired(),
        }),
});

export type StockTransactionSchema = yup.InferType<typeof stockTransactionSchema>;