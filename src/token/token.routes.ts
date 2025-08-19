import express from "express";
import { refreshSession, verifySession } from "./token.controller";

const router = express.Router();

router.get("/verify-token", verifySession);

router.post("/refresh-token", refreshSession);

export default router;
