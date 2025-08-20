import dotenv from "dotenv";
import "dotenv/config";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

import express from "express";
import { connectToDatabase } from "./infra/db/db.mongoose";
import session from "./session/session.routes";
import user from "./user/user.routes";
import token from "./token/token.routes";
import users from "./users/users.routes";
import middleware from "./middlewares/token.middleware";
import cookieparser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

(async () => {
  await connectToDatabase();

  app.get("/", (req, res) => {
    return res.json({ message: "It is on air." });
  });

  app.use("/", session);
  app.use("/", token);
  app.use("/user", middleware, user);
  app.use("/users", users);

  const PORT = process.env.PORT || 8080;
  app.listen(PORT);
})();
