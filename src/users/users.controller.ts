import { Request, Response } from "express";
import { getUserbyUsername, searchByUsername } from "./users.service";
import { notFoundStatus } from "../errors";

export async function getUser(req: Request, res: Response) {
  try {
    const { username } = req.params;

    const user = await getUserbyUsername(username);
    if (!user) return notFoundStatus(res, "User not found.");

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "error" });
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
    if (!users.length)
      return res
        .status(404)
        .json({ message: "An users with this username was not found." });

    const nextCursor = users[users.length - 1]._id;

    res.status(200).json({ users, nextCursor });
  } catch (err) {
    console.error(err, "caiu aqui?");
    res.status(500).json({ message: "error" });
  }
}
