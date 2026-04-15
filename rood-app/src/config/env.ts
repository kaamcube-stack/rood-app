/**
 * Base URL and other public env values (Expo injects `EXPO_PUBLIC_*` from `.env` at build time).
 * Restart Metro after changing `.env`.
 */

function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, '');
}

const DEFAULT_API_URL = 'http://127.0.0.1:8000';

const raw = process.env.EXPO_PUBLIC_API_URL;

export const API_BASE_URL =
  raw != null && String(raw).trim() !== '' ? stripTrailingSlash(String(raw).trim()) : DEFAULT_API_URL;

export const env = {
  apiBaseUrl: API_BASE_URL,
} as const;
