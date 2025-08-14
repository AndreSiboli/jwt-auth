import { Request, Response } from "express";
import { compare, encrypt } from "../common/lib/encrypt";
import {
  createUserInDB,
  getUserByEmail,
  getUsername,
} from "../user/user.service";
import { httpResponses } from "../errors/httpResponses";
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
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../common/errors";
import { handleSessionError } from "./session.errors";

export async function verifyLogin(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const user = await getUserByEmail(
      email,
      "-__v -passwordResetExpires -passwordResetToken"
    );
    const isValidPassword = user
      ? await compare(password, user.password)
      : false;

    if (!user || !isValidPassword) {
      throw new UnauthorizedError("Email or password is wrong.", {
        email,
        attemptedAction: "GET /sign-in",
      });
    }

    const token = signToken(user.id);
    const refreshToken = signRefreshToken(user.id);

    createCookie(res, "accessToken", token, { maxAge: config.cookieExpiresIn });
    createCookie(res, "refreshToken", refreshToken, {
      maxAge: config.refreshCookieExpiresIn,
    });

    await saveRefreshTokenDB({
      user_id: user.id,
      refresh_token: refreshToken,
    });

    const noSensitiveData = user.noSensitiveData();

    httpResponses.ok(res, {
      data: { user: noSensitiveData },
      message: "Sign-in successfully.",
    });
  } catch (err) {
    handleSessionError(res, err);
  }
}

export async function verifyRegister(req: Request, res: Response) {
  try {
    const { email, username, password, confirmPassword } = req.body;

    if (!isEmailValid(email)) {
      throw new BadRequestError(
        "Email is not valid. Example: usuario@dominio.com",
        { attemptedAction: "POST /sign-up" }
      );
    }
    if (!isUsernameValid(username)) {
      throw new BadRequestError(
        "Username is not valid. It must be 3-20 characters and contains only letter/number",
        { attemptedAction: "POST /sign-up" }
      );
    }
    if (!isPasswordValid(password, confirmPassword)) {
      throw new BadRequestError(
        "Password is not valid. It must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one symbol.",
        { attemptedAction: "POST /sign-up" }
      );
    }

    if (await getUsername(username)) {
      throw new ConflictError("This username already exists.", {
        attemptedAction: "POST /sign-up",
      });
    }
    if (await getUserByEmail(email, "-password")) {
      throw new ConflictError("This email already exists.", {
        attemptedAction: "POST /sign-up",
      });
    }

    await createUserInDB({ ...req.body });

    httpResponses.created(res, { message: "User registered successfully." });
  } catch (err) {
    handleSessionError(res, err);
  }
}

export async function verifyLogout(req: Request, res: Response) {
  try {
    const refreshToken = getCookie(req, "refreshToken");
    if (!refreshToken) {
      throw new BadRequestError("No token provided.", {
        attemptedAction: "GET /sign-out",
      });
    }

    const decoded = decodeToken(refreshToken);

    await deleteRefreshTokenDB({
      user_id: (decoded as JwtPayload).id,
      refresh_token: refreshToken,
    });

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    httpResponses.ok(res, { message: "You were disconnected." });
  } catch (err) {
    handleSessionError(res, err);
  }
}

export async function redefinePassword(req: Request, res: Response) {
  try {
    const { email } = req.body;

    const user = await usersModel.findOne({ email });
    if (!user) {
      throw new NotFoundError("User not found.", {
        attemptedAction: "POST /forget-password",
      });
    }

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

    httpResponses.ok(res, { message: "Email sent successfully." });
  } catch (err) {
    handleSessionError(res, err);
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const { password, confirmPassword } = req.body;
    const { token } = req.params;

    if (password !== confirmPassword) {
      throw new BadRequestError("Passwords doesn't match.");
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await usersModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
      throw new BadRequestError("Could not reset password.", {
        attemptedAction: "POST /reset-password",
        resetToken: token,
        internalMessage: "Failed to get password token.",
      });
    }

    user.password = await encrypt(password);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    httpResponses.ok(res, { message: "Password updated successfully." });
  } catch (err) {
    handleSessionError(res, err);
  }
}
