import { createMiddleware } from "hono/factory";
import jwt from "jsonwebtoken";

import { HttpStatusCodes } from "src/lib/http-status-codes";

export const authMiddleware = createMiddleware(async (c, next) => {
  const authorization = c.req.header("Authorization") || "";

  if (!authorization.startsWith("Bearer ")) {
    return c.json({ message: "Unauthorized" }, HttpStatusCodes.UNAUTHORIZED);
  }

  const token = authorization.split(" ")[1];

  try {
    const jwtResult = jwt.verify(token, process.env.JWT_SECRET as string) as {
      username: string;
    };
    c.set("user", jwtResult);
    return await next();
  } catch {
    return c.json({ message: "Unauthorized" }, 401);
  }
});
