import { Request } from "express";
import jwt, { JwtPayload as DefaultJwtPayload } from "jsonwebtoken";
import config from "./token.config";
import { getRefreshTokenDB } from "./token.service";
import { getCookie } from "../session/session.cookies";

interface DatasType {
  user_id: string;
  refresh_token: string;
}

export interface JwtPayload extends DefaultJwtPayload {
  id: string;
  iat: number;
  exp: number;
}

export function signToken(id: string) {
  return jwt.sign({ id }, config.secretToken, {
    expiresIn: config.expiresInToken,
  });
}

export function signRefreshToken(id: string) {
  return jwt.sign({ id }, config.secretRefreshToken, {
    expiresIn: config.expiresInRefreshToken,
  });
}

export function verifyToken(req: Request) {
  const token = getCookie(req, "accessToken");
  return jwt.verify(token, config.secretToken);
}

export function verifyRefreshToken(req: Request) {
  const refresh = getCookie(req, "refreshToken");
  return jwt.verify(refresh, config.secretRefreshToken);
  // req.user = { id: (decoded as JwtPayload).id };
  // return decoded;
}

export function decodeToken(token: string, complete = false) {
  return jwt.decode(token, { complete });
}

export async function isRefreshTokenExpired(data: DatasType) {
  const response = await getRefreshTokenDB(data);
  const expiresIn = response?.expiresIn || 0;
  const tokenDate = new Date(expiresIn);
  const currentDate = new Date();

  return currentDate.getTime() > tokenDate.getTime();
}

export async function isRefreshTokenOnDB(data: DatasType) {
  return !!(await getRefreshTokenDB(data));
}
