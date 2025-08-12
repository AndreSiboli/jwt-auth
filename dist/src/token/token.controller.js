"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySession = verifySession;
exports.refreshSession = refreshSession;
const errors_1 = require("../errors");
const user_service_1 = require("../user/user.service");
const token_service_1 = require("./token.service");
const session_cookies_1 = require("../session/session.cookies");
const session_config_1 = __importDefault(require("../session/session.config"));
const token_utils_1 = require("./token.utils");
const token_errors_1 = require("./token.errors");
const errors_2 = require("../common/errors");
function verifySession(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, token_utils_1.verifyToken)(req);
            res.status(200).json({ message: "User is authenticated." });
        }
        catch (err) {
            if ((0, token_errors_1.handleJwtError)(res, err))
                return;
            return (0, errors_1.internalServerErrorStatus)(res);
        }
    });
}
function refreshSession(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const payload = (0, token_utils_1.verifyRefreshToken)(req);
            if (typeof payload === "string" || !payload.id)
                throw new errors_2.UnauthorizedError("Invalid refresh token payload.");
            const user = yield (0, user_service_1.getUserById)(payload.id, "-password");
            if (!user)
                throw new errors_2.UnauthorizedError("User not found.");
            const prevRefreshToken = (0, session_cookies_1.getCookie)(req, "refreshToken");
            if (!prevRefreshToken)
                throw new errors_2.UnauthorizedError("Missing refresh token.");
            const token = (0, token_utils_1.signToken)(user.id);
            const refreshToken = (0, token_utils_1.signRefreshToken)(user.id);
            (0, session_cookies_1.createCookie)(res, "accessToken", token, { maxAge: session_config_1.default.cookieExpiresIn });
            (0, session_cookies_1.createCookie)(res, "refreshToken", refreshToken, {
                maxAge: session_config_1.default.refreshCookieExpiresIn,
            });
            const response = yield (0, token_service_1.updateRefreshTokenDB)({
                user_id: user.id,
                refresh_token: refreshToken,
                old_refresh_token: prevRefreshToken,
            });
            if (!response)
                throw new errors_2.UnauthorizedError("Update refresh token was not possible.");
            res.status(200).json({ message: "Session successfully renewed." });
        }
        catch (err) {
            if ((0, token_errors_1.handleJwtError)(res, err))
                return;
            return (0, errors_1.internalServerErrorStatus)(res);
        }
    });
}
