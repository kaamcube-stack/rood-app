/** Expo inlines `EXPO_PUBLIC_*` from `.env` — declare for TypeScript */
declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_API_URL?: string;
  }
}
