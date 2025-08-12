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
exports.getRefreshTokenDB = getRefreshTokenDB;
exports.saveRefreshTokenDB = saveRefreshTokenDB;
exports.updateRefreshTokenDB = updateRefreshTokenDB;
exports.deleteRefreshTokenDB = deleteRefreshTokenDB;
exports.manageTokenExpirationDB = manageTokenExpirationDB;
const token_model_1 = __importDefault(require("./token.model"));
const token_config_1 = __importDefault(require("../token/token.config"));
function getRefreshTokenDB(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield token_model_1.default.findOne({
            user_id: data.user_id,
            refresh_token: data.refresh_token,
        });
    });
}
function saveRefreshTokenDB(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const expiresInMill = token_config_1.default.expiresInRefreshToken * 1000;
        return yield new token_model_1.default({
            refresh_token: data.refresh_token,
            user_id: data.user_id,
            expiresIn: Date.now() + expiresInMill,
            updatedIn: Date.now(),
        }).save();
    });
}
function updateRefreshTokenDB(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const expiresInMill = token_config_1.default.expiresInRefreshToken * 1000;
        return yield token_model_1.default.findOneAndUpdate({ user_id: data.user_id, refresh_token: data.old_refresh_token }, {
            refresh_token: data.refresh_token,
            expiresIn: Date.now() + expiresInMill,
            updatedIn: Date.now(),
        });
    });
}
function deleteRefreshTokenDB(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield token_model_1.default.findOneAndDelete({
            user_id: data.user_id,
            refresh_token: data.refresh_token,
        });
    });
}
function manageTokenExpirationDB() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield token_model_1.default.deleteMany().where("expiresIn").lt(Date.now());
    });
}
