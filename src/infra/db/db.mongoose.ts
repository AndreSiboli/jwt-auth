import mongoose from "mongoose";

const dbURL =
  process.env.NODE_ENV === "production"
    ? process.env.DB_URL_PROD
    : process.env.DB_URL_DEV;

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(dbURL);
    console.log("MongoDB connected.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
