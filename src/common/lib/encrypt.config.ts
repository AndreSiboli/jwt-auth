import "dotenv/config";

export default {
  salt: parseInt(process.env.API_SALT),
};
