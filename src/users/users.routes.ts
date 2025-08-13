import express from "express";
import { searchUsers, getUser } from "./users.controller";

const router = express.Router();

router.get("/:username", getUser);

router.get("/search/:username", searchUsers);

export default router;
