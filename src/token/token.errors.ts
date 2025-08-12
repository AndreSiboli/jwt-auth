import { Response } from "express";
import { unauthorizedStatus } from "../errors";
import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";
import { UnauthorizedError } from "../common/errors";

export function handleJwtError(res: Response, err: unknown): boolean {
  const jwtErrors = [
    [JsonWebTokenError, "Invalid token signature"],
    [TokenExpiredError, "Token has expired"],
    [NotBeforeError, "Token not valid yet"],
    [UnauthorizedError, "Unauthorized"],
  ] as const;

  console.log(err instanceof UnauthorizedError);

  for (const [ErrorType, message] of jwtErrors) {
    if (err instanceof ErrorType) {
      unauthorizedStatus(res, "Unauthorized.");
      console.error(err.message || message);
      return true;
    }
  }

  return false;
}
