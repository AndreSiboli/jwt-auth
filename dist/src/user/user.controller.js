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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = getUser;
exports.deleteUser = deleteUser;
exports.updatePassword = updatePassword;
exports.updateUsername = updateUsername;
const encrypt_1 = require("../common/lib/encrypt");
const user_utils_1 = require("./user.utils");
const errors_1 = require("../errors");
const user_service_1 = require("./user.service");
function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.user)
                return;
            const { id } = req.user;
            const response = yield (0, user_service_1.getUserById)(id, "_id email username createdAt");
            if (!response)
                throw new Error();
            res.status(200).json({ user: response });
        }
        catch (err) {
            (0, errors_1.internalServerErrorStatus)(res);
        }
    });
}
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.user)
                return;
            const { id } = req.user;
            const response = yield (0, user_service_1.deleteUserById)(id);
            if (!response)
                throw new Error();
            res.status(200).json({ message: "The user was deleted." });
        }
        catch (err) {
            (0, errors_1.internalServerErrorStatus)(res);
        }
    });
}
function updatePassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.user)
                return;
            const { id } = req.user;
            const { password, confirmPassword, lastPassword } = req.body;
            const lastHash = yield (0, user_service_1.getUserPassword)(id);
            if (!lastHash)
                throw new Error();
            const isEqual = yield (0, encrypt_1.compare)(lastPassword, lastHash);
            if (!isEqual)
                throw new Error();
            if (!(0, user_utils_1.isPasswordValid)(password, confirmPassword))
                throw new Error();
            const encryptedPass = yield (0, encrypt_1.encrypt)(password);
            const response = yield (0, user_service_1.updateUserPassword)({ id, password: encryptedPass });
            if (!response)
                throw new Error();
            res.status(200).json({ message: "Updated successfully." });
        }
        catch (err) {
            (0, errors_1.internalServerErrorStatus)(res);
        }
    });
}
function updateUsername(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.user)
                return;
            const { id } = req.user;
            const { username } = req.body;
            if (!username)
                throw new Error();
            if (yield (0, user_service_1.getUsername)(username))
                return (0, errors_1.alredyExistsStatus)(res, "username");
            if (!(0, user_utils_1.isUsernameValid)(username))
                throw new Error();
            const response = yield (0, user_service_1.updateUserUsername)({ username, id });
            if (!response)
                throw new Error();
            res.status(200).json({ message: "Update successfully." });
        }
        catch (err) {
            (0, errors_1.internalServerErrorStatus)(res);
        }
    });
}
