import * as yup from "yup";

export const productSchema = yup.object({
  name: yup
    .string()
    .max(255, "Product name is too long")
    .required("Name is required"),
  price: yup.number().required("Price is required"),
  image: yup.string().required("Image is required"),
  categoryId: yup.string().required("Category is required"),
});
