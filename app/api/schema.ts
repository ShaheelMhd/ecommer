import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(3),
  description: z.string().max(255),
});

export const productSchema = z.object({
  name: z.string().min(3),
  description: z.string().max(2000),
  brand: z.string().max(100),
  specs: z
    .record(z.union([z.string(), z.number(), z.array(z.string())]))
    .nullable()
    .optional(),
  price: z.coerce.number().min(1),
  stock: z.coerce.number().min(1),
  category: z.string().max(191),
});

export const imageSchema = z.object({
  image: z
    .instanceof(File)
    .refine(
      (file) =>
        ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(
          file.type
        ),
      { message: "Invalid image file type." }
    )
    .optional()
    .nullable(),
  path: z.string().max(255),
  alt: z.string().max(255),
  isPrimary: z.boolean().optional(),
  productId: z.string().max(191),
});

export const userSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "Name must be at least 3 characters long." }),
    email: z.string().email({ message: "Email is not valid." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .max(100, { message: "Password is too long." })
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      )
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string({ message: "Field is required." }).optional(),
    role: z.enum(["user", "admin"]).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const cartSchema = z.object({
  productId: z.string().max(191),
  quantity: z.number().max(100).default(1),
});

export const reviewSchema = z.object({
  productId: z.string().max(191),
  rating: z.number().min(1).max(5),
  comment: z.string().min(3).max(500).optional(),
});
