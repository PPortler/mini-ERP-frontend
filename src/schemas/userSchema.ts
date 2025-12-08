import * as yup from "yup";

export const userCreateSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
  // confirmed_password: yup
  //   .string()
  //   .oneOf([yup.ref("password")], "Passwords must match")
  //   .required("Confirm Password is required"),
  first_name: yup.string().required("First Name is required"),
  last_name: yup.string().required("Last Name is required"),
  role: yup.string().required("Role is required"),
});

export const userEditSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  first_name: yup.string().required("First Name is required"),
  last_name: yup.string().required("Last Name is required"),
  role: yup.string().required("Role is required"),
});

