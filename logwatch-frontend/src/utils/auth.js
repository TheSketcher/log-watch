// ====================== src/utils/auth.js ============================
// Simple localStorage helpers – swap with real auth later
// src/utils/auth.js
const TOKEN_KEY = "token";
const USER_KEY = "user";

// --- token helpers ---
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);
export const isAuthenticated = () => !!getToken();

// --- user helpers ---
export const getStoredUser = () =>
  JSON.parse(localStorage.getItem(USER_KEY) || "null");
export const setStoredUser = (u) =>
  localStorage.setItem(USER_KEY, JSON.stringify(u));
export const removeStoredUser = () => localStorage.removeItem(USER_KEY);

// convenience wrappers
export const login = (token, user) => {
  setToken(token);
  if (user) setStoredUser(user);
};
export const logout = () => {
  removeToken();
  removeStoredUser();
};
