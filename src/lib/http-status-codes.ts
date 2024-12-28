const OK = 200;

const CREATED = 201;

const BAD_REQUEST = 400;

const UNAUTHORIZED = 401;

const NOT_FOUND = 404;

const INTERNAL_SERVER_ERROR = 500;

export const HttpStatusCodes = {
  OK,
  CREATED,
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} as const;
