import { OpenAPIHono } from "@hono/zod-openapi";

import type { AppBinding } from "src/lib/types";
import { HttpStatusCodes } from "src/lib/http-status-codes";

export const createRouter = () => {
  const app = new OpenAPIHono<AppBinding>({
    defaultHook: (result, c) => {
      if (!result.success) {
        const errors = result.error.errors.reduce<Record<string, string[]>>(
          (acc, error) => {
            const path = error.path.join(".");
            if (acc[path]) {
              acc[path] = [...acc[path], error.message];
            } else {
              acc[path] = [error.message];
            }
            return acc;
          },
          {},
        );

        return c.json(
          {
            message: "Invalid input provided",
            data: null,
            errors,
          },
          400,
        );
      }
    },
  });

  app.onError((err, c) => {
    console.log(`${err}`);
    return c.json(
      { data: null, errors: null, message: "Internal Server Error" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  });

  return app;
};

export const createApp = () => {
  return createRouter();
};
