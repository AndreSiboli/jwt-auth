import mongoose from "mongoose";

interface IUser {
  email: string;
  password: string;
  username: string;
  createdAt: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Number;
}

interface IUserMethods {
  noSensitiveData(): Omit<IUser, "password">;
}

type UserModel = mongoose.Model<IUser, {}, IUserMethods>;

const Schema = mongoose.Schema;

const users = new Schema<IUser, UserModel>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    // unique: true, //It's set down bellow
  },
  createdAt: {
    type: Date,
    required: true,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Number,
  },
});

users.methods.noSensitiveData = function () {
  const { password, ...safeData } = this.toObject();
  return safeData;
};

users.index(
  { username: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

export default mongoose.model<IUser, UserModel>("users", users);
