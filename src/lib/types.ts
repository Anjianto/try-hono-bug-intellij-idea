import type {
  OpenAPIHono,
  RouteConfig,
  RouteConfigToEnv,
  RouteHandler,
} from "@hono/zod-openapi";
import type { Env, Schema } from "hono";

export type AppBinding = {
  Variables: {
    user?: { username: string };
  };
};

export type AppOpenApi<
  E extends Env = AppBinding,
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  S extends Schema = {},
  BasePath extends string = "/",
> = OpenAPIHono<E, S, BasePath>;

export type AppRouteHandler<
  R extends RouteConfig,
  Env extends RouteConfigToEnv<R> = AppBinding,
> = RouteHandler<R, Env>;
