import {
  AppError,
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../common/errors";
import { httpResponses } from "../common/http/httpResponses";
import { Response } from "express";

export function handleUserError(res: Response, err: unknown) {
  const sessionErrors = [
    [UnauthorizedError, httpResponses.unauthorized],
    [BadRequestError, httpResponses.badRequest],
    [ConflictError, httpResponses.conflict],
    [NotFoundError, httpResponses.notFound],
  ] as const;

  for (const [ErrorType, response] of sessionErrors) {
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
