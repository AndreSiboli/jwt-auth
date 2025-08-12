declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      DB_URL_PROD: string;
      DB_URL_DEV: string;
      API_PORT: string;
      API_SECRET_TOKEN: string;
      API_SECRET_REFRESH_TOKEN: string;
      API_EXPIRES_TOKEN: string;
      API_EXPIRES_REFRESH_TOKEN: string;
      API_SALT: string;
      COOKIE_TOKEN_EXPIRES_IN: string;
      COOKIE_REFRESH_TOKEN_EXPIRES_IN: string;
      EMAIL_SENDER: string
      EMAIL_PASSWORD: string
    }
  }
}

export {};
