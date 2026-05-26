import axios from 'axios';

// In dev, Vite proxies "/api" to localhost:5000.
// In production, set VITE_API_URL to your deployed backend (e.g. https://api.example.com).
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api';

export const api = axios.create({
  baseURL,
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ah_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    // surface a clean message
    const msg = err?.response?.data?.error || err.message || 'Request failed';
    return Promise.reject(Object.assign(new Error(msg), { status: err?.response?.status, details: err?.response?.data?.details }));
  }
);
