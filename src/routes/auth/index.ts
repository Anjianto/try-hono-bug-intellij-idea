import { createRouter } from "src/lib/create-app";

import * as routes from "./routes";
import * as handlers from "./handlers";

export const authRouter = createRouter()
  .openapi(routes.login, handlers.login)
  .openapi(routes.register, handlers.register);
