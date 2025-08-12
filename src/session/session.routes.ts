import express from "express";
import {
  redefinePassword,
  resetPassword,
  verifyLogin,
  verifyLogout,
  verifyRegister,
} from "./session.controller";

const router = express.Router();

router.post("/sign-in", verifyLogin);

router.post("/sign-up", verifyRegister);

router.get("/sign-out", verifyLogout);

router.post("/forget-password", redefinePassword);

router.post("/reset-password/:token", resetPassword);

export default router;
