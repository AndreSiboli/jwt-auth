"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.badRequestStatus = badRequestStatus;
exports.unauthorizedStatus = unauthorizedStatus;
exports.notFoundStatus = notFoundStatus;
exports.alredyExistsStatus = alredyExistsStatus;
exports.internalServerErrorStatus = internalServerErrorStatus;
function badRequestStatus(res, message) {
    return res.status(400).json({
        message: message || "It was not possible to procced.",
    });
}
function unauthorizedStatus(res, message) {
    return res.status(401).json({
        message: message || `Access Denied.`,
    });
}
function notFoundStatus(res, message) {
    return res.status(404).json({
        message: message || "Not found.",
    });
}
function alredyExistsStatus(res, name) {
    return res.status(409).json({
        message: `This ${name} already exists.`,
    });
}
function internalServerErrorStatus(res, err) {
    return res.status(500).json({
        message: (err === null || err === void 0 ? void 0 : err.message) || `An error has occurred.`,
    });
}
