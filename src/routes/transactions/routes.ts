import { createRoute } from "@hono/zod-openapi";
import { HttpStatusCodes } from "src/lib/http-status-codes";
import { jsonContent, jsonContentRequired } from "src/lib/open-api";
import { z } from "zod";
import { authMiddleware } from "src/middlewares/auth";
import {
  transactionSchema,
  updateTransactionSchema,
} from "src/schema/transactions";

const tags = ["Transactions"];

export const transactions = createRoute({
  path: "/transactions",
  method: "get",
  tags,
  security: [{ Bearer: [] }],
  middleware: [authMiddleware] as const,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        data: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
            description: z.string().nullable(),
            categoryId: z.number(),
            transDate: z.bigint(),
            createdAt: z.date(),
            updatedAt: z.date(),
          }),
        ),
        errors: z.null(),
        message: z.string(),
      }),
      "Categories",
    ),
  },
  [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
    z.object({ message: z.string() }),
    "Unauthorized",
  ),
});

export const createTransaction = createRoute({
  path: "/transactions",
  method: "post",
  tags,
  security: [{ Bearer: [] }],
  middleware: [authMiddleware] as const,
  request: {
    body: jsonContentRequired(transactionSchema, "Create Transaction"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      z.object({
        data: z.object({
          id: z.number(),
          name: z.string(),
          description: z.string().nullable(),
          categoryId: z.number(),
          transDate: z.bigint(),
          createdAt: z.date(),
          updatedAt: z.date(),
        }),
        errors: z.null(),
        message: z.string(),
      }),
      "Successfully created transaction",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      z.object({
        data: z.null(),
        errors: z.object({
          name: z.array(z.string()).optional(),
          description: z.array(z.string()).optional(),
          amount: z.array(z.string()).optional(),
          categoryId: z.array(z.string()).optional(),
          transDate: z.array(z.string()).optional(),
        }),
      }),
      "Failed to create transaction",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      z.object({ message: z.string() }),
      "Unauthorized",
    ),
  },
});

export const transaction = createRoute({
  path: "/transactions/{id}",
  method: "get",
  tags,
  security: [{ Bearer: [] }],
  middleware: [authMiddleware] as const,
  request: {
    params: z.object({
      id: z.number().openapi({
        param: {
          name: "id",
          in: "path",
        },
        example: 101,
      }),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        data: z.object({
          id: z.number(),
          name: z.string(),
          description: z.string().nullable(),
          categoryId: z.number(),
          transDate: z.bigint(),
          createdAt: z.date(),
          updatedAt: z.date(),
        }),
        errors: z.null(),
        message: z.string(),
      }),
      "Categories",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({ data: z.null(), errors: z.null(), message: z.string() }),
      "Not Found",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      z.object({ message: z.string() }),
      "Unauthorized",
    ),
  },
});

export const updateTransaction = createRoute({
  path: "/transactions/{id}",
  method: "put",
  tags,
  security: [{ Bearer: [] }],
  middleware: [authMiddleware] as const,
  request: {
    params: z.object({
      id: z.number().openapi({
        param: {
          name: "id",
          in: "path",
        },
        example: 101,
      }),
    }),
    body: jsonContentRequired(updateTransactionSchema, "Update Transaction"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        data: z.object({
          id: z.number(),
          name: z.string(),
          description: z.string().nullable(),
          categoryId: z.number(),
          transDate: z.bigint(),
          createdAt: z.date(),
          updatedAt: z.date(),
        }),
        errors: z.null(),
        message: z.string(),
      }),
      "Categories",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({ data: z.null(), errors: z.null(), message: z.string() }),
      "Not Found",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      z.object({ message: z.string() }),
      "Unauthorized",
    ),
  },
});

export const deleteTransaction = createRoute({
  path: "/transactions/{id}",
  method: "delete",
  tags,
  security: [{ Bearer: [] }],
  middleware: [authMiddleware] as const,
  request: {
    params: z.object({
      id: z.number().openapi({
        param: {
          name: "id",
          in: "path",
        },
        example: 101,
      }),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        data: z.null(),
        errors: z.null(),
        message: z.string(),
      }),
      "Categories",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({ data: z.null(), errors: z.null(), message: z.string() }),
      "Not Found",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      z.object({ message: z.string() }),
      "Unauthorized",
    ),
  },
});

export type TransactionsRoute = typeof transactions;
export type CreateTransactionRoute = typeof createTransaction;
export type TransactionRoute = typeof transaction;
export type UpdateTransactionRoute = typeof updateTransaction;
export type DeleteTransactionRoute = typeof deleteTransaction;
