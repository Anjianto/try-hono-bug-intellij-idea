import { createRouter } from "src/lib/create-app";
import * as routes from "./routes";
import * as handlers from "./handlers";

export const categoriesRouter = createRouter().openapi(
  routes.getCategories,
  handlers.categories,
);
