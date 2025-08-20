import { Request, Response } from "express";
import { compare, encrypt } from "../common/lib/encrypt";
import { isPasswordValid, isUsernameValid } from "./user.utils";
import { httpResponses } from "../common/http/httpResponses";
import {
  deleteUserById,
  getUserPassword,
  getUserById,
  getUsername,
  updateUserPassword,
  updateUserUsername,
} from "./user.service";
import {
  BadRequestError,
  ConflictError,
  InternalError,
  NotFoundError,
  UnauthorizedError,
} from "../common/errors";
import { handleUserError } from "./user.errors";

export async function getUser(req: Request, res: Response) {
  try {
    if (!req.user) {
      throw new UnauthorizedError(
        "You must be logged in to get your account.",
        {
          attemptedAction: "GET /user",
        }
      );
    }

    const { id } = req.user;
    const user = await getUserById(id, "_id email username createdAt");

    if (!user) {
      throw new NotFoundError("User not found.", {
        attemptedAction: "GET /user",
      });
    }

    httpResponses.ok(res, { data: { user } });
  } catch (err) {
    handleUserError(res, err);
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    if (!req.user) {
      throw new UnauthorizedError(
        "You must be logged in to delete your account.",
        {
          attemptedAction: "DELETE /user",
        }
      );
    }

    const { id } = req.user;
    const isUserDeleted = await deleteUserById(id);

    if (!isUserDeleted) {
      throw new InternalError(undefined, {
        attemptedAction: "DELETE /user",
        internalMessage: "User can't be deleted from database.",
      });
    }

    httpResponses.ok(res, { message: "User deleted successfully." });
  } catch (err) {
    handleUserError(res, err);
  }
}

export async function updatePassword(req: Request, res: Response) {
  try {
    if (!req.user) {
      throw new UnauthorizedError(
        "You must be logged in to update your password.",
        {
          attemptedAction: "GET /user",
        }
      );
    }

    const { id } = req.user;
    const { password, confirmPassword, lastPassword } = req.body;

    const lastHash = await getUserPassword(id);
    const isEqual = lastHash ? await compare(lastPassword, lastHash) : false;

    if (!lastHash || !isEqual) {
      throw new BadRequestError("Your last password is not valid.", {
        attemptedAction: "PATCH /user/password",
      });
    }

    if (!isPasswordValid(password, confirmPassword)) {
      throw new BadRequestError(
        "Password is not valid. It must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one symbol.",
        {
          attemptedAction: "PATCH /user/password",
        }
      );
    }

    const encryptedPass = await encrypt(password);

    const isUpdated = await updateUserPassword({ id, password: encryptedPass });
    if (!isUpdated) {
      throw new BadRequestError("It was not possible to update password.", {
        attemptedAction: "PATCH /user/password",
      });
    }

    httpResponses.ok(res, { message: "User password updated successfully." });
  } catch (err) {
    handleUserError(res, err);
  }
}

export async function updateUsername(req: Request, res: Response) {
  try {
    if (!req.user) return;
    const { id } = req.user;
    const { username } = req.body;

    if (!isUsernameValid(username)) {
      throw new BadRequestError(
        "Username is not valid. It must be 3-20 characters and contains only letter/number",
        {
          attemptedAction: "PATCH /user/username",
        }
      );
    }

    if (await getUsername(username)) {
      throw new ConflictError("This username already exists.", {
        attemptedAction: "PATCH /user/username",
      });
    }

    const isUpdated = await updateUserUsername({ username, id });
    if (!isUpdated) {
      throw new BadRequestError("It was not possible to update username.", {
        attemptedAction: "PATCH /user/username",
      });
    }

    httpResponses.ok(res, { message: "Username updated successfully." });
  } catch (err) {
    handleUserError(res, err);
  }
}
