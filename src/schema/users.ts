import { z } from "zod";

export const registerSchema = z.object({
  username: z.string(),
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(1),
});

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name is required",
    })
    .email({ message: "Invalid email" }),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password is required",
    })
    .min(1, { message: "Password is required" }),
});
