import { CookieOptions, Request, Response } from "express";
import config from "./session.config";

export function createCookie(
  res: Response,
  name: string,
  token: string,
  options?: CookieOptions
) {
  res.cookie(name, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: config.cookieExpiresIn,
    ...options,
  });
}

export function getCookie(req: Request, name: string) {
  return req.cookies[name];
}
