export function isUsernameValid(username: string) {
  const validUsernamePattern = /^[A-Za-z0-9][A-Za-z0-9_-]{2,}$/;
  return validUsernamePattern.test(username);
}

export function isEmailValid(email: string) {
  const validEmailPattern =
    /^(?=.{1,255}$)(?=[^@]{3,}@)[A-Za-z0-9][A-Za-z0-9.!#$%&'*+\/=?^_`{|}~-]*[A-Za-z0-9]@[A-Za-z0-9][A-Za-z0-9]*\.com$/;
  return validEmailPattern.test(email);
}

export function isPasswordValid(password: string, confirmPassword: string) {
  const validPasswordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-])[A-Za-z\d!@#$%^&*(),.?":{}|<>_\-]{8,}$/;
  return validPasswordPattern.test(password) && password === confirmPassword;
}
