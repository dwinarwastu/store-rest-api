import { z } from "zod";

export const outletIdSchema = z.object({
  id: z
    .string()
    .min(24, "id must be 24 characters long")
    .max(24, "id must be 24 characters long"),
});

export const createOutletSchema = z.object({
  name: z.string().min(3).max(100),
  location: z.string().min(3).max(100),
});

export const updateOutletSchema = z.object({
  name: z.string().min(3).max(100),
  location: z.string().min(3).max(100),
});
