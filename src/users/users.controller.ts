import { Request, Response } from "express";
import { getUserbyUsername, searchByUsername } from "./users.service";
import { httpResponses } from "../errors/httpResponses";
import { handleUsersError } from "../users/users.errors";
import { NotFoundError } from "../common/errors";

export async function getUser(req: Request, res: Response) {
  try {
    const { username } = req.params;

    const user = await getUserbyUsername(username);
    if (!user) {
      throw new NotFoundError("User not found.", {
        attemptedAction: "GET /users/:username",
      });
    }

    httpResponses.ok(res, { data: { user } });
  } catch (err) {
    handleUsersError(res, err);
  }
}

export async function searchUsers(req: Request, res: Response) {
  try {
    const { username } = req.params;
    const { limit, cursor } = req.query;
    const options: { limit?: string; cursor?: string } = {};

    if (typeof limit === "string") options.limit = limit;
    if (typeof cursor === "string") options.cursor = cursor;

    const users = await searchByUsername(username, options);
    if (!users.length) {
      throw new NotFoundError("An users with this username was not found.", {
        attempedAction: "GET /users/search/:username",
      });
    }

    const nextCursor = users[users.length - 1]._id;

    httpResponses.ok(res, { data: { users, nextCursor } });
  } catch (err) {
    handleUsersError(res, err);
  }
}
