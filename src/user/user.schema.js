import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3).max(100),
  password: z.string().min(8),
  email: z.string().email().min(3),
});

export const updateUserSchema = z.object({
  email: z.string().email().min(3),
});
