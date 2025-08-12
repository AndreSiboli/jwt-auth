"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const refreshToken = new Schema({
    user_id: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        refs: "users",
        required: true,
    },
    refresh_token: {
        type: String,
        required: true,
    },
    expiresIn: {
        type: Date,
        required: true,
    },
    updatedIn: {
        type: Date,
        required: true,
    },
});
exports.default = mongoose_1.default.model("refresh-token", refreshToken);
