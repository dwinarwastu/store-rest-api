import { z } from "zod";

export const categoryIdSchema = z.object({
  id: z
    .string()
    .min(24, "id must be 24 characters long")
    .max(24, "id must be 24 characters long"),
});

export const createCategorySchema = z.object({
  name: z.string().min(3).max(100),
});

export const updateCategorySchema = z.object({
  name: z.string().min(3).max(100),
});
