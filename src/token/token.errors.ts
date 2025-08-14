import { Response } from "express";
import { httpResponses } from "../errors/httpResponses";
import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";
import { AppError, UnauthorizedError } from "../common/errors";

export function handleTokenError(res: Response, err: unknown) {
  const jwtErrors = [
    [JsonWebTokenError, httpResponses.unauthorized],
    [TokenExpiredError, httpResponses.unauthorized],
    [NotBeforeError, httpResponses.unauthorized],
    [UnauthorizedError, httpResponses.unauthorized],
  ] as const;

  for (const [ErrorType, response] of jwtErrors) {
    if (err instanceof ErrorType) {
      if (err instanceof AppError) console.error(err.toJSON());
      else console.error((err as Error).stack || (err as Error).message);
      
      response(res, err.message);
      return true;
    }
  }

  if (err instanceof Error) {
    console.error(err.stack || err.message);
    httpResponses.internal(res);
  }

  return false;
}
