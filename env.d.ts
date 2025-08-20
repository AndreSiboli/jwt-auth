declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      DB_URL_PROD: string;
      DB_URL_DEV: string;
      PORT: string;
      SESSION_SECRET_TOKEN: string;
      SESSION_SECRET_REFRESH_TOKEN: string;
      SESSION_EXPIRES_TOKEN: string;
      SESSION_EXPIRES_REFRESH_TOKEN: string;
      SESSION_SALT_ROUNDS: string;
      COOKIE_DEFAULT_EXPIRES_IN: string;
      COOKIE_TOKEN_EXPIRES_IN: string;
      COOKIE_REFRESH_TOKEN_EXPIRES_IN: string;
      EMAIL_SENDER: string;
      EMAIL_PASSWORD: string;
    }
  }
}

export {};
