import { Request, Response } from "express";
import { compare, encrypt } from "../common/lib/encrypt";
import { isPasswordValid, isUsernameValid } from "./user.utils";
import { alredyExistsStatus, internalServerErrorStatus } from "../errors";
import {
  deleteUserById,
  getUserPassword,
  getUserById,
  getUsername,
  updateUserPassword,
  updateUserUsername,
} from "./user.service";

export async function getUser(req: Request, res: Response) {
  try {
    if (!req.user) return;
    const { id } = req.user;
    const response = await getUserById(id, "_id email username createdAt");
    if (!response) throw new Error();

    res.status(200).json({ user: response });
  } catch (err) {
    internalServerErrorStatus(res);
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    if (!req.user) return;
    const { id } = req.user;
    const response = await deleteUserById(id);
    if (!response) throw new Error();

    res.status(200).json({ message: "The user was deleted." });
  } catch (err) {
    internalServerErrorStatus(res);
  }
}

export async function updatePassword(req: Request, res: Response) {
  try {
    if (!req.user) return;
    const { id } = req.user;
    const { password, confirmPassword, lastPassword } = req.body;
    const lastHash = await getUserPassword(id);
    if (!lastHash) throw new Error();

    const isEqual = await compare(lastPassword, lastHash);
    if (!isEqual) throw new Error();

    if (!isPasswordValid(password, confirmPassword)) throw new Error();

    const encryptedPass = await encrypt(password);

    const response = await updateUserPassword({ id, password: encryptedPass });
    if (!response) throw new Error();

    res.status(200).json({ message: "Updated successfully." });
  } catch (err) {
    internalServerErrorStatus(res);
  }
}

export async function updateUsername(req: Request, res: Response) {
  try {
    if (!req.user) return;
    const { id } = req.user;
    const { username } = req.body;

    if (!username) throw new Error();
    if (await getUsername(username)) return alredyExistsStatus(res, "username");

    if (!isUsernameValid(username)) throw new Error();

    const response = await updateUserUsername({ username, id });
    if (!response) throw new Error();

    res.status(200).json({ message: "Update successfully." });
  } catch (err) {
    internalServerErrorStatus(res);
  }
}
