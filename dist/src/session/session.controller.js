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
exports.verifyLogin = verifyLogin;
exports.verifyRegister = verifyRegister;
exports.verifyLogout = verifyLogout;
exports.redefinePassword = redefinePassword;
exports.resetPassword = resetPassword;
const encrypt_1 = require("../common/lib/encrypt");
const user_service_1 = require("../user/user.service");
const errors_1 = require("../errors");
const session_cookies_1 = require("./session.cookies");
const session_service_1 = require("./session.service");
const user_utils_1 = require("../user/user.utils");
const token_service_1 = require("../token/token.service");
const token_utils_1 = require("../token/token.utils");
const session_config_1 = __importDefault(require("./session.config"));
const user_model_1 = __importDefault(require("../user/user.model"));
const crypto_1 = __importDefault(require("crypto"));
function verifyLogin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const user = yield (0, user_service_1.getUserByEmail)(email, "-__v -passwordResetExpires -passwordResetToken");
            if (!user)
                throw new Error();
            const isValidPassword = yield (0, encrypt_1.compare)(password, user.password);
            if (!isValidPassword)
                throw new Error();
            const token = (0, token_utils_1.signToken)(user.id);
            const refreshToken = (0, token_utils_1.signRefreshToken)(user.id);
            if (!token || !refreshToken)
                throw new Error();
            (0, session_cookies_1.createCookie)(res, "accessToken", token, { maxAge: session_config_1.default.cookieExpiresIn });
            (0, session_cookies_1.createCookie)(res, "refreshToken", refreshToken, {
                maxAge: session_config_1.default.refreshCookieExpiresIn,
            });
            const savedInDB = yield (0, token_service_1.saveRefreshTokenDB)({
                user_id: user.id,
                refresh_token: refreshToken,
            });
            if (!savedInDB)
                throw new Error();
            const noSensitiveData = user.noSensitiveData();
            res
                .status(200)
                .json({ user: noSensitiveData, messeage: "Login successfully" });
        }
        catch (err) {
            (0, errors_1.unauthorizedStatus)(res);
        }
    });
}
function verifyRegister(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, username, password, confirmPassword } = req.body;
            if (yield (0, user_service_1.getUsername)(username))
                throw new Error("This username already exists");
            if (yield (0, user_service_1.getUserByEmail)(email, "-password"))
                throw new Error("This email already exists");
            if (!(0, user_utils_1.isEmailValid)(email))
                throw new Error();
            if (!(0, user_utils_1.isUsernameValid)(username))
                throw new Error();
            if (!(0, user_utils_1.isPasswordValid)(password, confirmPassword))
                throw new Error();
            yield (0, user_service_1.createUserInDB)(Object.assign({}, req.body));
            return res.status(201).json({ message: "User registered successfully" });
        }
        catch (err) {
            (0, errors_1.internalServerErrorStatus)(res, err);
        }
    });
}
function verifyLogout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const refresh = (0, session_cookies_1.getCookie)(req, "refreshToken");
            if (!refresh)
                return (0, errors_1.badRequestStatus)(res, "No token provided.");
            const decoded = (0, token_utils_1.decodeToken)(refresh);
            yield (0, token_service_1.deleteRefreshTokenDB)({
                user_id: decoded.id,
                refresh_token: refresh,
            });
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            res.status(200).json({ message: "You were disconected." });
        }
        catch (err) {
            return (0, errors_1.internalServerErrorStatus)(res);
        }
    });
}
function redefinePassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            const user = yield user_model_1.default.findOne({ email });
            if (!user)
                return (0, errors_1.notFoundStatus)(res, "User not found.");
            const resetToken = crypto_1.default.randomBytes(32).toString("hex");
            const hashedToken = crypto_1.default
                .createHash("sha256")
                .update(resetToken)
                .digest("hex");
            user.passwordResetToken = hashedToken;
            user.passwordResetExpires = Date.now() + 15 * 60 * 1000;
            yield user.save();
            const resetURL = `http://localhost:8585/reset-password/${resetToken}`;
            yield (0, session_service_1.sendRecoveryPassword)(email, resetURL);
            res.status(200).json({ message: "Email sent." });
        }
        catch (err) {
            console.error(err);
            (0, errors_1.internalServerErrorStatus)(res);
        }
    });
}
function resetPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { password, confirmPassword } = req.body;
            const { token } = req.params;
            if (password !== confirmPassword)
                throw new Error();
            const hashedToken = crypto_1.default.createHash("sha256").update(token).digest("hex");
            const user = yield user_model_1.default.findOne({
                passwordResetToken: hashedToken,
                passwordResetExpires: { $gt: Date.now() },
            });
            if (!user)
                throw new Error();
            user.password = yield (0, encrypt_1.encrypt)(password);
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            yield user.save();
            res.status(200).json({ message: "Password updated successfully" });
        }
        catch (err) {
            console.error(err);
            (0, errors_1.internalServerErrorStatus)(res);
        }
    });
}
