import { z } from "zod";

export const productIdSchema = z.object({
  id: z
    .string()
    .min(24, "id must be 24 characters long")
    .max(24, "id must be 24 characters long"),
});

export const createProductSchema = z.object({
  name: z.string().min(3).max(100),
  price: z.number().min(1),
  image: z.string().min(3).max(100),
  categoryId: z
    .string()
    .min(24, "id must be 24 characters long")
    .max(24, "id must be 24 characters long"),
});

export const updateProductSchema = z.object({
  name: z.string().min(3).max(100),
  price: z.number().min(1),
  image: z.string().min(3).max(100),
  categoryId: z
    .string()
    .min(24, "id must be 24 characters long")
    .max(24, "id must be 24 characters long"),
  outletId: z
    .string()
    .min(24, "id must be 24 characters long")
    .max(24, "id must be 24 characters long"),
});
