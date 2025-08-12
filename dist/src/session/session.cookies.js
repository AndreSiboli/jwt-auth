"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCookie = createCookie;
exports.getCookie = getCookie;
const session_config_1 = __importDefault(require("./session.config"));
function createCookie(res, name, token, options) {
    res.cookie(name, token, Object.assign({ httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: session_config_1.default.cookieExpiresIn }, options));
}
function getCookie(req, name) {
    return req.cookies[name];
}
