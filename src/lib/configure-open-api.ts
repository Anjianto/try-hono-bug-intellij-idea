import { apiReference } from "@scalar/hono-api-reference";

import type { AppOpenApi } from "src/lib/types";
import packageJson from "package.json";

export const configureOpenApi = (app: AppOpenApi) => {
  app.doc("/docs", {
    openapi: "3.0.0",
    info: {
      version: packageJson.version,
      title: "Financial Allocator",
    },
  });

  app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
    type: "http",
    scheme: "bearer",
  });

  app.get(
    "/reference",
    apiReference({
      theme: "kepler",
      layout: "classic",
      defaultHttpClient: {
        targetKey: "js",
        clientKey: "axios",
      },
      spec: {
        url: "/docs",
      },
    }),
  );
};
