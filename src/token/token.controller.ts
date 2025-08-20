import { Request, Response } from "express";
import { httpResponses } from "../common/http/httpResponses";
import { getUserById } from "../user/user.service";
import { updateRefreshTokenDB } from "./token.service";
import { createCookie, getCookie } from "../session/session.cookies";
import config from "../session/session.config";
import {
  signRefreshToken,
  signToken,
  verifyRefreshToken,
  verifyToken,
} from "./token.utils";
import { handleTokenError } from "./token.errors";
import { JwtPayload } from "./token.types";
import { UnauthorizedError } from "../common/errors";

export async function verifySession(req: Request, res: Response) {
  try {
    verifyToken(req);
    httpResponses.ok(res, { message: "User is authenticated." });
  } catch (err) {
    handleTokenError(res, err);
  }
}

export async function refreshSession(req: Request, res: Response) {
  try {
    const payload = verifyRefreshToken(req);

    if (typeof payload === "string" || !(payload.id as JwtPayload))
      throw new UnauthorizedError("Invalid refresh token payload.");

    const user = await getUserById(payload.id, "-password");
    if (!user) throw new UnauthorizedError("User not found.");

    const prevRefreshToken = getCookie(req, "refreshToken");
    if (!prevRefreshToken)
      throw new UnauthorizedError("Missing refresh token.");

    const token = signToken(user.id);
    const refreshToken = signRefreshToken(user.id);

    createCookie(res, "accessToken", token, { maxAge: config.cookieExpiresIn });
    createCookie(res, "refreshToken", refreshToken, {
      maxAge: config.refreshCookieExpiresIn,
    });

    const response = await updateRefreshTokenDB({
      user_id: user.id,
      refresh_token: refreshToken,
      old_refresh_token: prevRefreshToken,
    });
    if (!response)
      throw new UnauthorizedError("Update refresh token was not possible.");

    httpResponses.ok(res, { message: "Session successfully renewed." });
  } catch (err) {
    handleTokenError(res, err);
  }
}
