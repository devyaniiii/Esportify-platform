// Simple browser-based auth for the demo (no backend yet).
// TODO: replace every function here with calls to the Spring Boot API.

const USERS_KEY = "esportify_users";
const PLAYER_KEY = "esportify_current";
const ADMIN_KEY = "esportify_admin_session";

// Admins can't sign up from the website. Until the backend exists, this one
// demo account is the only admin. Change or remove it before going live.
export const DEMO_ADMIN = {
  name: "Esportify Admin",
  email: "admin@esportify.com",
  password: "Admin@2026",
};

export const readUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
};

export const saveUsers = (users) =>
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

/* ---------------- Player ---------------- */

export const getCurrentPlayer = () => {
  const email =
    sessionStorage.getItem(PLAYER_KEY) || localStorage.getItem(PLAYER_KEY);
  if (!email) return null;
  return (
    readUsers().find((u) => u.email === email && u.accountType !== "admin") ||
    null
  );
};

export const startPlayerSession = (email, remember = false) => {
  localStorage.removeItem(PLAYER_KEY);
  sessionStorage.removeItem(PLAYER_KEY);
  (remember ? localStorage : sessionStorage).setItem(PLAYER_KEY, email);
};

export const logoutPlayer = () => {
  localStorage.removeItem(PLAYER_KEY);
  sessionStorage.removeItem(PLAYER_KEY);
};

/* ---------------- Admin ---------------- */

export const getAdminSession = () =>
  sessionStorage.getItem(ADMIN_KEY) === DEMO_ADMIN.email ? DEMO_ADMIN : null;

export const loginAdmin = (email, password) => {
  if (
    email.trim().toLowerCase() === DEMO_ADMIN.email &&
    password === DEMO_ADMIN.password
  ) {
    sessionStorage.setItem(ADMIN_KEY, DEMO_ADMIN.email);
    return true;
  }
  return false;
};

export const logoutAdmin = () => sessionStorage.removeItem(ADMIN_KEY);
