import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:5192';

let authToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

/** Chamado quando a API retorna 401; use para logout + redirect (ex.: em AppRoutes). */
export function setOnUnauthorized(callback: (() => void) | null) {
  onUnauthorized = callback;
}

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  // Login não deve enviar token (evita 401 por token expirado/inválido)
  if (config.url?.includes('/api/auth/login')) {
    return config;
  }
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      setAuthToken(null);
      onUnauthorized?.();
    }
    return Promise.reject(error);
  }
);