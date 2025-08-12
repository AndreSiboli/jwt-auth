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
exports.signToken = signToken;
exports.signRefreshToken = signRefreshToken;
exports.verifyToken = verifyToken;
exports.verifyRefreshToken = verifyRefreshToken;
exports.decodeToken = decodeToken;
exports.isRefreshTokenExpired = isRefreshTokenExpired;
exports.isRefreshTokenOnDB = isRefreshTokenOnDB;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const token_config_1 = __importDefault(require("./token.config"));
const token_service_1 = require("./token.service");
const session_cookies_1 = require("../session/session.cookies");
function signToken(id) {
    return jsonwebtoken_1.default.sign({ id }, token_config_1.default.secretToken, {
        expiresIn: token_config_1.default.expiresInToken,
    });
}
function signRefreshToken(id) {
    return jsonwebtoken_1.default.sign({ id }, token_config_1.default.secretRefreshToken, {
        expiresIn: token_config_1.default.expiresInRefreshToken,
    });
}
function verifyToken(req) {
    const token = (0, session_cookies_1.getCookie)(req, "accessToken");
    return jsonwebtoken_1.default.verify(token, token_config_1.default.secretToken);
}
function verifyRefreshToken(req) {
    const refresh = (0, session_cookies_1.getCookie)(req, "refreshToken");
    return jsonwebtoken_1.default.verify(refresh, token_config_1.default.secretRefreshToken);
    // req.user = { id: (decoded as JwtPayload).id };
    // return decoded;
}
function decodeToken(token, complete = false) {
    return jsonwebtoken_1.default.decode(token, { complete });
}
function isRefreshTokenExpired(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield (0, token_service_1.getRefreshTokenDB)(data);
        const expiresIn = (response === null || response === void 0 ? void 0 : response.expiresIn) || 0;
        const tokenDate = new Date(expiresIn);
        const currentDate = new Date();
        return currentDate.getTime() > tokenDate.getTime();
    });
}
function isRefreshTokenOnDB(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return !!(yield (0, token_service_1.getRefreshTokenDB)(data));
    });
}
