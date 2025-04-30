import { z } from "zod";

export const createOrderSchema = z.object({
  orderItems: z
    .array(
      z.object({
        product: z.string().length(24, "Invalid productId"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
      })
    )
    .min(1, "At least one order item is required"),
  shippingAddress: z.string().min(3).max(100),
  phone: z.string().min(11).max(14),
  status: z.string().min(3).max(100),
});

export const orderIdSchema = z.object({
  id: z
    .string()
    .min(24, "id must be 24 characters long")
    .max(24, "id must be 24 characters long"),
});

export const updateStatusOrderSchema = z.object({
  status: z.string().min(1).max(100),
});

export const addOrderItemsSchema = z.object({
  orderItems: z
    .array(
      z.object({
        product: z.string().length(24, "Invalid productId"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
      })
    )
    .min(1, "At least one order item is required"),
});


