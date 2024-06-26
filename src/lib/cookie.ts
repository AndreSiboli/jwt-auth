import { Request, Response } from "express";
import { createRefreshToken, createToken } from "./token";
import jwt, { JwtPayload as DefaultJwtPayload } from "jsonwebtoken";

interface JwtPayload extends DefaultJwtPayload {
  id: string;
  iat: number;
  exp: number;
}

export function createTokenCookie(id: string, res: Response) {
  const obj2Str = JSON.stringify({ token: createToken(id) });

  res.cookie("auth", obj2Str, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 60 * 1000,
  });
}

export async function createRefreshTokenCookie(id: string, res: Response) {
  const refresh = createRefreshToken(id);
  const obj2Str = JSON.stringify({ refreshToken: refresh });

  res.cookie("refresh_auth", obj2Str, {
    httpOnly: true,
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
  });

  return refresh;
}

export function getTokenFromCookie(req: Request, res: Response) {
  try {
    return JSON.parse(req.cookies.auth).token as string;
  } catch (error) {
    return null;
  }
}

export function getRefreshTokenFromCookie(req: Request, res: Response) {
  try {
    return JSON.parse(req.cookies.refresh_auth)?.refreshToken as string;
  } catch (error) {
    return null;
  }
}

export function getIdFromRefreshToken(refresh: string) {
  const token = jwt.decode(refresh, { complete: true });
  return (token?.payload as JwtPayload).id;
}
