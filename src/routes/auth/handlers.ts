import type { AppRouteHandler } from "src/lib/types";
import type { LoginRoute, RegisterRoute } from "src/routes/auth/routes";
import { prisma } from "src/db";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { HttpStatusCodes } from "src/lib/http-status-codes";

export const register: AppRouteHandler<RegisterRoute> = async (c) => {
  const validated = c.req.valid("json");

  if (process.env.ENABLED_REGISTER !== "true") {
    return c.json(
      { message: `Cannot POST ${c.req.url}` },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  const hashPassword = await bcrypt.hash(validated.password, 10);

  await prisma.user.create({
    data: { ...validated, password: hashPassword },
  });

  return c.json(
    { message: "Successfully registered" },
    HttpStatusCodes.CREATED,
  );
};

export const login: AppRouteHandler<LoginRoute> = async (c) => {
  const validated = await c.req.valid("json");

  const result = await prisma.user.findUnique({
    where: { email: validated.email },
  });

  if (!result) {
    return c.json(
      {
        message: "Email or password is incorrect",
        data: null,
        errors: null,
      },
      HttpStatusCodes.BAD_REQUEST,
    );
  }

  const isPasswordCorrect = await bcrypt.compare(
    validated.password,
    result.password,
  );

  if (!isPasswordCorrect) {
    return c.json(
      {
        message: "Email or password is incorrect",
        data: null,
        errors: null,
      },
      HttpStatusCodes.BAD_REQUEST,
    );
  }

  const token = jwt.sign(
    { username: result.username },
    process.env.JWT_SECRET as string,
  );

  return c.json(
    {
      data: { token },
      errors: null,
      message: "Successfully logged in",
    },
    HttpStatusCodes.OK,
  );
};
