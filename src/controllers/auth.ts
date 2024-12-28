import { Handler } from "express";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { prisma } from "src/db";
import { loginSchema } from "src/schema/users";
import { validate } from "src/utils/validate";

export const register: Handler = async (req, res) => {
  if (process.env.ENABLED_REGISTER !== "true") {
    return res.status(404).json({ message: `Cannot POST ${req.originalUrl}` });
  }

  const hashPassword = await bcrypt.hash(req.body.password, 10);

  await prisma.user.create({
    data: { ...req.body, password: hashPassword },
  });

  res.status(201).json({ message: "Successfully registered" });
};

export const login: Handler = async (req, res) => {
  const resultSchema = await validate(loginSchema, req.body);

  if (!resultSchema.success) {
    res.status(400).json({
      message: "Invalid input provided",
      data: null,
      errors: resultSchema.errors,
    });
    return;
  }

  const result = await prisma.user.findUnique({
    where: { email: resultSchema.data.email },
  });

  if (!result) {
    res.status(400).json({
      message: "Email or password is incorrect",
      data: null,
      errors: null,
    });
    return;
  }

  const isPasswordCorrect = await bcrypt.compare(
    resultSchema.data.password,
    result.password,
  );

  if (!isPasswordCorrect) {
    res.status(400).json({
      message: "Email or password is incorrect",
      data: null,
      errors: null,
    });
    return;
  }

  const token = jwt.sign(
    { username: result.username },
    process.env.JWT_SECRET as string,
  );

  res.json({ data: { token }, message: "Successfully logged in" });
};
