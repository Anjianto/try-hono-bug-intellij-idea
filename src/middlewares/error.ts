import { ErrorRequestHandler } from "express";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  // eslint-disable-next-line
  console.error(err.stack);

  res.status(err.status || 500).json({
    message: "Internal Server Error",
    data: null,
    errors: null,
  });
};
