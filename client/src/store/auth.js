import { create } from 'zustand';
import { authApi } from '../api/endpoints.js';

const TOKEN_KEY = 'ah_token';
const USER_KEY = 'ah_user';

function loadInitial() {
  try {
    const user = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    const token = localStorage.getItem(TOKEN_KEY);
    return { user, token };
  } catch {
    return { user: null, token: null };
  }
}

export const useAuth = create((set, get) => ({
  ...loadInitial(),
  initialized: false,

  async init() {
    const { token } = get();
    if (!token) return set({ initialized: true });
    try {
      const { user } = await authApi.me();
      set({ user, initialized: true });
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {
      get().logout();
      set({ initialized: true });
    }
  },

  async login(email, password) {
    const { user, token } = await authApi.login({ email, password });
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ user, token });
    return user;
  },

  async register(name, email, password) {
    const { user, token } = await authApi.register({ name, email, password });
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ user, token });
    return user;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({ user: null, token: null });
  },

  setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ user });
  },
}));
