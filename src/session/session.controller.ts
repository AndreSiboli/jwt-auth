import { Request, Response } from "express";
import { compare, encrypt } from "../common/lib/encrypt";
import {
  createUserInDB,
  getUserByEmail,
  getUsername,
} from "../user/user.service";
import {
  unauthorizedStatus,
  badRequestStatus,
  internalServerErrorStatus,
  notFoundStatus,
} from "../errors";
import { createCookie, getCookie } from "./session.cookies";
import { sendRecoveryPassword } from "./session.service";
import {
  isEmailValid,
  isUsernameValid,
  isPasswordValid,
} from "../user/user.utils";
import {
  deleteRefreshTokenDB,
  saveRefreshTokenDB,
} from "../token/token.service";
import {
  signRefreshToken,
  signToken,
  decodeToken,
  JwtPayload,
} from "../token/token.utils";
import config from "./session.config";
import usersModel from "../user/user.model";
import crypto from "crypto";

export async function verifyLogin(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const user = await getUserByEmail(
      email,
      "-__v -passwordResetExpires -passwordResetToken"
    );
    if (!user) throw new Error();

    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) throw new Error();

    const token = signToken(user.id);
    const refreshToken = signRefreshToken(user.id);
    if (!token || !refreshToken) throw new Error();

    createCookie(res, "accessToken", token, { maxAge: config.cookieExpiresIn });
    createCookie(res, "refreshToken", refreshToken, {
      maxAge: config.refreshCookieExpiresIn,
    });

    const savedInDB = await saveRefreshTokenDB({
      user_id: user.id,
      refresh_token: refreshToken,
    });
    if (!savedInDB) throw new Error();

    const noSensitiveData = user.noSensitiveData();

    res
      .status(200)
      .json({ user: noSensitiveData, messeage: "Login successfully" });
  } catch (err) {
    unauthorizedStatus(res);
  }
}

export async function verifyRegister(req: Request, res: Response) {
  try {
    const { email, username, password, confirmPassword } = req.body;

    if (await getUsername(username))
      throw new Error("This username already exists");
    if (await getUserByEmail(email, "-password"))
      throw new Error("This email already exists");

    if (!isEmailValid(email)) throw new Error();
    if (!isUsernameValid(username)) throw new Error();
    if (!isPasswordValid(password, confirmPassword)) throw new Error();

    await createUserInDB({ ...req.body });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    internalServerErrorStatus(res, err as Error);
  }
}

export async function verifyLogout(req: Request, res: Response) {
  try {
    const refresh = getCookie(req, "refreshToken");

    if (!refresh) return badRequestStatus(res, "No token provided.");

    const decoded = decodeToken(refresh);

    await deleteRefreshTokenDB({
      user_id: (decoded as JwtPayload).id,
      refresh_token: refresh,
    });

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({ message: "You were disconected." });
  } catch (err) {
    return internalServerErrorStatus(res);
  }
}

export async function redefinePassword(req: Request, res: Response) {
  try {
    const { email } = req.body;

    const user = await usersModel.findOne({ email });
    if (!user) return notFoundStatus(res, "User not found.");

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetURL = `http://localhost:8585/reset-password/${resetToken}`;

    await sendRecoveryPassword(email, resetURL);

    res.status(200).json({ message: "Email sent." });
  } catch (err) {
    console.error(err);
    internalServerErrorStatus(res);
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const { password, confirmPassword } = req.body;
    const { token } = req.params;

    if (password !== confirmPassword) throw new Error();

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await usersModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error();

    user.password = await encrypt(password);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    internalServerErrorStatus(res);
  }
}
