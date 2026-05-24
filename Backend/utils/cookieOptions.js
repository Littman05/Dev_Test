const {
  ACCESS_TOKEN_COOKIE_MAX_AGE,
  REFRESH_TOKEN_COOKIE_MAX_AGE,
} = require("../constants");

const isProduction = process.env.NODE_ENV === "production";

const baseCookieOptions = {
  path: "/",
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
};

if (isProduction && process.env.CLIENT_URL) {
  baseCookieOptions.domain = process.env.CLIENT_URL;
}

const accessTokenCookieOptions = {
  ...baseCookieOptions,
  httpOnly: true,
  maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE,
};

const refreshTokenCookieOptions = {
  ...baseCookieOptions,
  httpOnly: true,
  maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE,
};

const loggedInUserInfoCookieOptions = {
  ...baseCookieOptions,
  httpOnly: false,
  maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE,
};

const clearCookieOptions = {
  httpOnly: true,
  secure: baseCookieOptions.secure,
  sameSite: baseCookieOptions.sameSite,
  path: "/",
  ...(baseCookieOptions.domain ? { domain: baseCookieOptions.domain } : {}),
};

module.exports = {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
  loggedInUserInfoCookieOptions,
  clearCookieOptions,
};
