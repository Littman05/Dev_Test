const mongoDB_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shopcart";

const BASE_URL = process.env.CORS_ORIGIN || "http://localhost:5173";

const ACCESS_TOKEN_COOKIE_MAX_AGE = 15 * 60 * 1000;
const REFRESH_TOKEN_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

module.exports = {
  mongoDB_URI,
  BASE_URL,
  ACCESS_TOKEN_COOKIE_MAX_AGE,
  REFRESH_TOKEN_COOKIE_MAX_AGE,
};
