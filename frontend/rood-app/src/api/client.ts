import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../config/env';

/** Must match `authStore` / backend expectations */
const AUTH_TOKEN_KEY = 'auth_token';

export { API_BASE_URL };

/** Single shared Axios instance — import this everywhere instead of `axios` directly. */
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => status >= 200 && status < 300,
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail?: unknown; message?: string }>) => {
    return Promise.reject(error);
  },
);

/** Normalize Axios / network errors for alerts and forms */
export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { detail?: unknown; message?: string } | undefined;
    if (typeof data?.message === 'string' && data.message.trim()) return data.message;
    if (typeof data?.detail === 'string' && data.detail.trim()) return data.detail;
    if (Array.isArray(data?.detail) && data.detail.length) {
      const first = data.detail[0];
      if (typeof first === 'object' && first && 'msg' in first && typeof (first as { msg: string }).msg === 'string') {
        return (first as { msg: string }).msg;
      }
    }
    if (error.message === 'Network Error') return 'No network connection';
    if (error.response?.status === 401) return 'Session expired. Please sign in again.';
    if (error.response?.status === 404) return 'Not found';
    if (error.response?.status && error.response.status >= 500) return 'Server error. Try again later.';
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export default api;
