"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = validateToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_1 = require("../errors");
const session_cookies_1 = require("../session/session.cookies");
const token_config_1 = __importDefault(require("../token/token.config"));
function validateToken(req, res, next) {
    const token = (0, session_cookies_1.getCookie)(req, "accessToken");
    if (!token)
        return (0, errors_1.unauthorizedStatus)(res);
    const decoded = jsonwebtoken_1.default.verify(token, token_config_1.default.secretToken);
    if (!decoded || typeof decoded === "string") {
        return (0, errors_1.unauthorizedStatus)(res);
    }
    req.user = { id: decoded.id };
    next();
}
