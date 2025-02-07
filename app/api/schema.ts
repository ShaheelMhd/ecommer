import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(3),
  description: z.string().max(255),
});

export const productSchema = z.object({
  name: z.string().min(3),
  description: z.string().max(2000),
  price: z.number(),
  stock: z.number(),
  categoryId: z.string().max(191),
});

export const imageSchema = z.object({
  path: z.string().max(255),
  alt: z.string().max(255),
  isPrimary: z.boolean(),
  productId: z.string().max(191),
});

export const userSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    )
    .regex(/[0-9]/, "Password must contain at least one number"),
  role: z.enum(["user", "admin"]).optional(),
});

export const cartSchema = z.object({
  // no need to check because the userId is derived from backend
  // and not sent by the user in the api
  // userId: z.string().max(191), 
  productId: z.string().max(191),
  quantity: z.number().max(100).default(1),
});
