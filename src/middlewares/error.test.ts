import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
  MockInstance,
  vi,
} from "vitest";
import { Request } from "express";
import { getMockRes } from "vitest-mock-express";

import { errorMiddleware } from "./error";

const { res, next } = getMockRes();

describe("Error Middleware", () => {
  let consoleErrorMock: MockInstance;

  // Just to hide the error message on console
  beforeAll(() => {
    // Mock console.error
    consoleErrorMock = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    // Restore console.error
    consoleErrorMock.mockRestore();
  });

  it("should handle errors and send proper response", () => {
    const mockError = new Error("Test error");
    const mockRequest = {} as Request;

    errorMiddleware(mockError, mockRequest, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      data: null,
      errors: null,
      message: "Internal Server Error",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
