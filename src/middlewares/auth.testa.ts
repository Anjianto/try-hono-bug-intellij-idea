import jwt from "jsonwebtoken";
import { expect, describe, it } from "vitest";
import { getMockReq, getMockRes } from "vitest-mock-express";

import { authMiddleware } from "src/middlewares/auth";

const { res, next } = getMockRes({});

describe("authMiddleware", () => {
  const secret = "test-secret";
  const username = "test";

  it("returns 401 if authorization header is missing or incorrect", async () => {
    const req = getMockReq();

    authMiddleware(req, res, next);
    const expectedResponse = { message: "Unauthorized" };

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });

  it("returns 401 if the jwt token is invalid", async () => {
    const req = getMockReq({
      headers: { authorization: "Bearer invalid-token" },
    });

    authMiddleware(req, res, next);
    const expectedResponse = { message: "Unauthorized" };

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });

  it("calls next with no arguments if the jwt token is valid", async () => {
    const token = jwt.sign({ username }, secret);
    process.env.JWT_SECRET = secret;

    const req = getMockReq({
      headers: { authorization: `Bearer ${token}` },
    });

    authMiddleware(req, res, next);
    expect(next).toBeCalledWith();
    expect(req.user).toEqual({ iat: expect.any(Number), username });
  });
});
