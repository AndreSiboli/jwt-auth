"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    cookieExpiresIn: parseInt(process.env.COOKIE_TOKEN_EXPIRES_IN),
    refreshCookieExpiresIn: parseInt(process.env.COOKIE_REFRESH_TOKEN_EXPIRES_IN),
    emailSender: process.env.EMAIL_SENDER,
    emailPassword: process.env.EMAIL_PASSWORD,
};
