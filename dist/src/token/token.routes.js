"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const token_controller_1 = require("./token.controller");
const router = express_1.default.Router();
router.get("/token", token_controller_1.verifySession);
router.post("/refresh-token", token_controller_1.refreshSession);
exports.default = router;
