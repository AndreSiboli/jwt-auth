"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
exports.default = {
    salt: parseInt(process.env.API_SALT),
};
