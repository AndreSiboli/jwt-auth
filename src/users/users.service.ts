import userModel from "../user/user.model";
import { defineLimit } from "./users.utils";

export async function searchByUsername(
  username: string,
  options?: { limit?: string; cursor?: string }
) {
  const { limit, cursor } = options || {};
  const definedLimit = defineLimit(limit, { minNumber: 1, maxNumber: 25 });
  const query: { username: any; _id?: { $gt: string } } = {
    username: { $regex: username, $options: "i" },
  };

  if (cursor) query._id = { $gt: cursor };

  return await userModel
    .find(query)
    .select("-__v -password -passwordResetToken -passwordResetExpires")
    .sort({ _id: 1 })
    .limit(definedLimit);
}

export async function getUserbyUsername(username: string) {
  return await userModel
    .findOne({ username })
    .select("-__v -password -passwordResetToken -passwordResetExpires")
    .collation({ locale: "en", strength: 2 });
}

export async function getUserById(id: string, fields?: string) {
  return await userModel.findById(id, fields);
}
