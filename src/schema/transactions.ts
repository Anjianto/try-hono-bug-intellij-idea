import { z } from "zod";

export const transactionSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name is required",
    })
    .min(1, { message: "Name is required" }),
  description: z.string().default(""),
  categoryId: z
    .number({
      required_error: "Category Id is required",
      invalid_type_error: "Category Id is required",
    })
    .min(1, "Category Id is required"),
  amount: z.number().default(0),
  transDate: z
    .number({ required_error: "Trans Date is required" })
    .int({ message: "Cannot be a decimal" })
    .min(0, { message: "Trans Date is required" }),
});

export const updateTransactionSchema = transactionSchema.partial();
