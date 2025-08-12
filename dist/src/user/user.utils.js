"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUsernameValid = isUsernameValid;
exports.isEmailValid = isEmailValid;
exports.isPasswordValid = isPasswordValid;
function isUsernameValid(username) {
    const validUsernamePattern = /^[A-Za-z0-9][A-Za-z0-9_-]{2,}$/;
    return validUsernamePattern.test(username);
}
function isEmailValid(email) {
    const validEmailPattern = /^(?=.{1,255}$)(?=[^@]{3,}@)[A-Za-z0-9][A-Za-z0-9.!#$%&'*+\/=?^_`{|}~-]*[A-Za-z0-9]@[A-Za-z0-9][A-Za-z0-9]*\.com$/;
    return validEmailPattern.test(email);
}
function isPasswordValid(password, confirmPassword) {
    const validPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-])[A-Za-z\d!@#$%^&*(),.?":{}|<>_\-]{8,}$/;
    return validPasswordPattern.test(password) && password === confirmPassword;
}
