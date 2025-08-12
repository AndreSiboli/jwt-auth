import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { unauthorizedStatus } from "../errors";
import { getCookie } from "../session/session.cookies";
import config from "../token/token.config";

export default function validateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = getCookie(req, "accessToken");
  if (!token) return unauthorizedStatus(res);

  const decoded = jwt.verify(token, config.secretToken as string);
  if (!decoded || typeof decoded === "string") {
    return unauthorizedStatus(res);
  }

  req.user = { id: decoded.id };
  next();
}
