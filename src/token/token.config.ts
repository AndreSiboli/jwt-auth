export default {
  secretToken: process.env.SESSION_SECRET_TOKEN,
  secretRefreshToken: process.env.SESSION_SECRET_REFRESH_TOKEN,
  expiresInToken: parseInt(process.env.SESSION_EXPIRES_TOKEN),
  expiresInRefreshToken: parseInt(process.env.SESSION_EXPIRES_REFRESH_TOKEN),
};
