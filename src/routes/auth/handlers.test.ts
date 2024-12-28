import { describe, expect, it, vi } from "vitest";
import * as bcrypt from "bcrypt";

import { login, register } from "./handlers";
import { prismaMock } from "src/utils/test/prisma-singleton";
import { createMockContext, nextMock } from "src/lib/mock";
import { HttpStatusCodes } from "src/lib/http-status-codes";

vi.mock("bcrypt");
vi.mock("jsonwebtoken", () => ({
  default: { sign: vi.fn().mockReturnValue("token") },
}));

describe("Auth - Register", () => {
  it("should not register a user if registration is disabled", async () => {
    process.env.ENABLED_REGISTER = "false";

    const cMock = createMockContext({
      method: "post",
      url: "/auth/register",
      headers: { "content-type": "application/json" },
      body: {
        name: "Test User",
        username: "testUser",
        email: "test@user.com",
        password: "testPassword",
      },
    });

    cMock.req.valid = vi.fn().mockReturnValue({ password: "" });

    await register(cMock, nextMock);

    expect(cMock.json).toHaveBeenCalledWith(
      { message: `Cannot POST ${cMock.req.url}` },
      404,
    );
  });

  it("should register a user successfully", async () => {
    process.env.ENABLED_REGISTER = "true";

    const cMock = createMockContext({
      method: "post",
      url: "/auth/register",
      headers: { "content-type": "application/json" },
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

    await register(cMock, nextMock);

    expect(cMock.json).toHaveBeenCalledWith(
      {
        message: "Successfully registered",
      },
      HttpStatusCodes.CREATED,
    );
  });
});

describe("Auth - Login", () => {
  it("should return a token when login is successful", async () => {
    const cMock = createMockContext({
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

    await login(cMock, nextMock);

    expect(cMock.json).toHaveBeenCalledWith(
      {
        data: { token: "token" },
        errors: null,
        message: "Successfully logged in",
      },
      HttpStatusCodes.OK,
    );
  });

  it("should return an error if user does not exist", async () => {
    const cMock = createMockContext({
      body: {
        email: "not@existent.com",
        password: "somePassword",
      },
    });

    prismaMock.user.findUnique.mockResolvedValue(null);

    await login(cMock, nextMock);

    expect(cMock.json).toHaveBeenCalledWith(
      {
        message: "Email or password is incorrect",
        data: null,
        errors: null,
      },
      HttpStatusCodes.BAD_REQUEST,
    );
  });

  it("should return an error if password is incorrect", async () => {
    const cMock = createMockContext({
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

    await login(cMock, nextMock);

    expect(cMock.json).toHaveBeenCalledWith(
      {
        message: "Email or password is incorrect",
        data: null,
        errors: null,
      },
      HttpStatusCodes.BAD_REQUEST,
    );
  });
});
