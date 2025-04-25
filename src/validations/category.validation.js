import * as yup from "yup";

export const categorySchema = yup.object({
  name: yup
    .string()
    .max(255, "Category name is too long")
    .required("Name is required"),
});
