export default {
  secretToken: process.env.API_SECRET_TOKEN,
  secretRefreshToken: process.env.API_SECRET_REFRESH_TOKEN,
  expiresInToken: parseInt(process.env.API_EXPIRES_TOKEN),
  expiresInRefreshToken: parseInt(process.env.API_EXPIRES_REFRESH_TOKEN),
};
