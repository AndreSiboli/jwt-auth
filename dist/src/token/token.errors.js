"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleJwtError = handleJwtError;
const errors_1 = require("../errors");
const jsonwebtoken_1 = require("jsonwebtoken");
const errors_2 = require("../common/errors");
function handleJwtError(res, err) {
    const jwtErrors = [
        [jsonwebtoken_1.JsonWebTokenError, "Invalid token signature"],
        [jsonwebtoken_1.TokenExpiredError, "Token has expired"],
        [jsonwebtoken_1.NotBeforeError, "Token not valid yet"],
        [errors_2.UnauthorizedError, "Unauthorized"],
    ];
    console.log(err instanceof errors_2.UnauthorizedError);
    for (const [ErrorType, message] of jwtErrors) {
        if (err instanceof ErrorType) {
            (0, errors_1.unauthorizedStatus)(res, "Unauthorized.");
            console.error(err.message || message);
            return true;
        }
    }
    return false;
}
