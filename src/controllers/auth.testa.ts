import { describe, it, expect, vi } from "vitest";
import { getMockReq, getMockRes } from "vitest-mock-express";
import * as bcrypt from "bcrypt";

import { login, register } from "./auth";
import { prismaMock } from "src/utils/test/prisma-singleton";

const { res, next } = getMockRes();

vi.mock("bcrypt");
vi.mock("jsonwebtoken", () => ({
  default: { sign: vi.fn().mockReturnValue("token") },
}));

describe("Auth - Register", () => {
  it("should not register a user if registration is disabled", async () => {
    const req = getMockReq({ originalUrl: "/auth/register" });

    await register(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: `Cannot POST ${req.originalUrl}`,
    });
  });

  it("should register a user successfully", async () => {
    process.env.ENABLED_REGISTER = "true";

    const req = getMockReq({
      body: {
        name: "Test User",
        username: "testUser",
        email: "test@user.com",
        password: "testPassword",
      },
    });

    prismaMock.user.create.mockResolvedValue({
      id: 1,
      name: "Test User",
      username: "testUser",
      email: "test@user.com",
      password: "SomeHashedPassword",
    });

    await register(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Successfully registered",
    });
  });
});

describe("Auth - Login", () => {
  it("should return a token when login is successful", async () => {
    const req = getMockReq({
      body: {
        email: "test@user.com",
        password: "testPassword",
      },
    });

    prismaMock.user.findUnique.mockResolvedValue({
      id: 1,
      name: "Test User",
      username: "testUser",
      email: "test@user.com",
      password: "Some Hash",
    });

    vi.spyOn(bcrypt, "compare").mockImplementation(() => true);

    await login(req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      data: { token: "token" },
      message: "Successfully logged in",
    });
  });

  it("should return an error if email or password is missing", async () => {
    const req = getMockReq({
      body: {
        email: "",
        password: "",
      },
    });

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid input provided",
      data: null,
      errors: { email: ["Invalid email"], password: ["Password is required"] },
    });
  });

  it("should return an error if user does not exist", async () => {
    const req = getMockReq({
      body: {
        email: "not@existent.com",
        password: "somePassword",
      },
    });

    prismaMock.user.findUnique.mockResolvedValue(null);

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Email or password is incorrect",
      data: null,
      errors: null,
    });
  });

  it("should return an error if password is incorrect", async () => {
    const req = getMockReq({
      body: {
        email: "test@user.com",
        password: "wrongPassword",
      },
    });

    prismaMock.user.findUnique.mockResolvedValue({
      id: 1,
      name: "Test User",
      username: "testUser",
      email: "test@user.com",
      password: "Correct Hash",
    });

    vi.spyOn(bcrypt, "compare").mockImplementation(() => false);

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Email or password is incorrect",
      data: null,
      errors: null,
    });
  });
});
