import usersModel from "./user.model";
import { encrypt } from "../common/lib/encrypt";

export async function createUserInDB(data: {
  email: string;
  username: string;
  password: string;
}) {
  const { email, username, password } = data;
  const hashedPassword = await encrypt(password);

  return await new usersModel({
    username,
    email,
    password: hashedPassword,
    createdAt: Date.now(),
  }).save();
}

export async function getUserById(id: string, fields?: string) {
  return await usersModel.findById(id, fields);
}

export async function getUserByEmail(email: string, fields?: string) {
  return await usersModel.findOne({ email }, fields);
}

export async function updateUserPassword(data: {
  id: string;
  password: string;
}) {
  const { id, password } = data;
  return await usersModel.findByIdAndUpdate(id, { password });
}

export async function updateUserUsername(data: {
  id: string;
  username: string;
}) {
  const { id, username } = data;
  return await usersModel.findByIdAndUpdate(id, { username });
}

export async function deleteUserById(id: string) {
  return await usersModel.findByIdAndDelete(id);
}

export async function getUserPassword(id: string) {
  return (await usersModel.findById(id))?.password;
}

export async function getUsername(username: string) {
  return (
    await usersModel
      .findOne({ username })
      .collation({ locale: "en", strength: 2 })
  )?.username;
}
