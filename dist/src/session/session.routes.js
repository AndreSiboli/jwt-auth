"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const session_controller_1 = require("./session.controller");
const router = express_1.default.Router();
router.post("/sign-in", session_controller_1.verifyLogin);
router.post("/sign-up", session_controller_1.verifyRegister);
router.get("/sign-out", session_controller_1.verifyLogout);
router.post("/forget-password", session_controller_1.redefinePassword);
router.post("/reset-password/:token", session_controller_1.resetPassword);
exports.default = router;
