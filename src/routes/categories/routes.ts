import { createRoute } from "@hono/zod-openapi";
import { HttpStatusCodes } from "src/lib/http-status-codes";
import { jsonContent } from "src/lib/open-api";
import { z } from "zod";
import { authMiddleware } from "src/middlewares/auth";

const tags = ["Categories"];

export const getCategories = createRoute({
  path: "/categories",
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
            categories: z.array(
              z.object({
                id: z.number(),
                name: z.string(),
              }),
            ),
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

export type GetCategoriesRoute = typeof getCategories;
