import type { Context, Env, ExecutionContext, Next } from "hono";
import { vi } from "vitest";
import type { AppBinding } from "src/lib/types";

export const createMockContext = <E extends Env = AppBinding>(
  requestProps: {
    method?: string;
    url?: string;
    headers?: Record<string, string>;
    body?: any;
  } = {},
): Context<E> => {
  // Mock response object
  const mockResponse = {
    status: 200,
    headers: new Map<string, string>(),
    body: null as string | null,
    setStatus: function (statusCode: number) {
      this.status = statusCode;
    },
    setHeader: function (key: string, value: string) {
      this.headers.set(key, value);
    },
    send: function (body: string) {
      this.body = body;
    },
  };

  // Mock request object
  const mockRequest = {
    method: requestProps.method || "GET",
    url: requestProps.url || "/",
    headers: new Headers(requestProps.headers || {}),
    body: requestProps.body,
    valid: vi.fn().mockResolvedValue(requestProps.body),
  };

  // Create the mock context
  const ctx = {
    req: mockRequest,
    res: mockResponse,
    env: {} as E,
    executionCtx: {} as ExecutionContext,
    event: {} as Request,
    text: (text: string) => {
      ctx.res.setStatus(200);
      ctx.res.send(text);
      return ctx.res;
    },
    json: vi.fn(),
    status: (statusCode: number) => {
      ctx.res.setStatus(statusCode);
      return ctx;
    },
    header: (key: string, value: string) => {
      ctx.res.setHeader(key, value);
      return ctx;
    },
  };

  return ctx as unknown as Context<E>;
};

export const nextMock: Next = vi.fn();
