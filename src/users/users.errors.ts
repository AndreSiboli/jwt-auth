import {
  AppError,
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../common/errors";
import { httpResponses } from "../common/http/httpResponses";
import { Response } from "express";

export function handleUsersError(res: Response, err: unknown) {
  const sessionErrors = [[NotFoundError, httpResponses.notFound]] as const;

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
