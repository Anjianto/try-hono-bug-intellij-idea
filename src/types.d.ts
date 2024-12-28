interface BigInt {
  toJSON: () => number;
}

declare namespace Express {
  export interface Request {
    user?: { username: string };
  }
}
