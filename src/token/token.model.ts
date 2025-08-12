import mongoose from "mongoose";

const Schema = mongoose.Schema;

const refreshToken = new Schema({
  user_id: {
    type: mongoose.SchemaTypes.ObjectId,
    refs: "users",
    required: true,
  },
  refresh_token: {
    type: String,
    required: true,
  },
  expiresIn: {
    type: Date,
    required: true,
  },
  updatedIn: {
    type: Date,
    required: true,
  },
});

export default mongoose.model("refresh-token", refreshToken);
