import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import { loginSchema, registerSchema } from "src/schema/users";
import { HttpStatusCodes } from "src/lib/http-status-codes";
import { jsonContent, jsonContentRequired } from "src/lib/open-api";

const tags = ["Auth"];

export const register = createRoute({
  path: "/auth/register",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(registerSchema, "Register"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      z.object({ message: z.string() }),
      "Success register",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({ message: z.string() }),
      "Register disabled",
    ),
  },
});

export const login = createRoute({
  path: "/auth/login",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(loginSchema, "Login"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        data: z.object({
          token: z.string(),
        }),
        errors: z.null(),
        message: z.string(),
      }),
      "Success login",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      z
        .object({
          data: z.null(),
          errors: z.object({
            email: z.array(z.string()).optional(),
            password: z.array(z.string()).optional(),
          }),
          message: z.string(),
        })
        .or(
          z.object({
            data: z.null(),
            errors: z.null(),
            message: z.string(),
          }),
        ),
      "Invalid input provided",
    ),
  },
});

export type LoginRoute = typeof login;
export type RegisterRoute = typeof register;
