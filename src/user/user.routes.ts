import express from "express";
import {
  deleteUser,
  updateUsername,
  updatePassword,
  getUser,
} from "./user.controller";

const router = express.Router();

router.get("/", getUser);

router.delete("/", deleteUser);

router.patch("/password", updatePassword);

router.patch("/username", updateUsername);

export default router;
