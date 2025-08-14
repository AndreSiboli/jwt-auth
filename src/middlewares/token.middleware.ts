import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { httpResponses } from "../errors/httpResponses";
import { getCookie } from "../session/session.cookies";
import config from "../token/token.config";
import { UnauthorizedError } from "../common/errors";

export default function validateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = getCookie(req, "accessToken");
    if (!token) {
      throw new UnauthorizedError(undefined, {
        attemptedAction: "middleware",
      });
    }

    const decoded = jwt.verify(token, config.secretToken as string);
    if (!decoded || typeof decoded === "string") {
      throw new UnauthorizedError(undefined, {
        attemptedAction: "middleware",
      });
    }

    req.user = { id: decoded.id };
    next();
  } catch (err) {
    httpResponses.unauthorized(res);
  }
}
