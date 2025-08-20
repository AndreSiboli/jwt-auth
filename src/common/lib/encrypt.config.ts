import "dotenv/config";

export default {
  salt: parseInt(process.env.SESSION_SALT_ROUNDS),
};
