import { z } from "zod";

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGES_MIME_TYPES = [
  "image/jpg",
  "image/png",
  "image/jpeg",
  "image/webp",
];

export const productIdSchema = z.object({
  id: z
    .string()
    .min(24, "id must be 24 characters long")
    .max(24, "id must be 24 characters long"),
});

export const imageProductSchema = z.object({
  image: z
    .any()
    .refine((file) => {
      if (!file) return false;
      return file.size <= MAX_FILE_SIZE;
    }, "max image size is 5mb")
    .refine((file) => {
      if (!file) return false;
      return ACCEPTED_IMAGES_MIME_TYPES.includes(file.mimetype);
    }, "only .jpeg .jpg .png .webp formats are supported"),
});

export const createProductSchema = z.object({
  name: z.string().min(3).max(100),
  price: z.coerce.number().min(1),
  categoryId: z
    .string()
    .min(24, "id must be 24 characters long")
    .max(24, "id must be 24 characters long"),
});

export const updateProductSchema = z.object({
  name: z.string().min(3).max(100),
  price: z.number().min(1),
  categoryId: z
    .string()
    .min(24, "id must be 24 characters long")
    .max(24, "id must be 24 characters long"),
  outletId: z
    .string()
    .min(24, "id must be 24 characters long")
    .max(24, "id must be 24 characters long"),
});
