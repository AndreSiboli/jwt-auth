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
exports.createUserInDB = createUserInDB;
exports.getUserById = getUserById;
exports.getUserByEmail = getUserByEmail;
exports.updateUserPassword = updateUserPassword;
exports.updateUserUsername = updateUserUsername;
exports.deleteUserById = deleteUserById;
exports.getUserPassword = getUserPassword;
exports.getUsername = getUsername;
const user_model_1 = __importDefault(require("./user.model"));
const encrypt_1 = require("../common/lib/encrypt");
function createUserInDB(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, username, password } = data;
        const hashedPassword = yield (0, encrypt_1.encrypt)(password);
        return yield new user_model_1.default({
            username,
            email,
            password: hashedPassword,
            createdAt: Date.now(),
        }).save();
    });
}
function getUserById(id, fields) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield user_model_1.default.findById(id, fields);
    });
}
function getUserByEmail(email, fields) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield user_model_1.default.findOne({ email }, fields);
    });
}
function updateUserPassword(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, password } = data;
        return yield user_model_1.default.findByIdAndUpdate(id, { password });
    });
}
function updateUserUsername(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, username } = data;
        return yield user_model_1.default.findByIdAndUpdate(id, { username });
    });
}
function deleteUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield user_model_1.default.findByIdAndDelete(id);
    });
}
function getUserPassword(id) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        return (_a = (yield user_model_1.default.findById(id))) === null || _a === void 0 ? void 0 : _a.password;
    });
}
function getUsername(username) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        return (_a = (yield user_model_1.default.findOne({ username }))) === null || _a === void 0 ? void 0 : _a.username;
    });
}
