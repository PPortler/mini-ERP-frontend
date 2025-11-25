import * as yup from "yup";

export const loginSchema = yup.object().shape({
  username: yup
    .string()
    .trim()
    .required(() => "username invalid"),
  password: yup
    .string()
    .trim()
    .required(() => "password invalid"),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;
