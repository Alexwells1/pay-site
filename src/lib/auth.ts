// src/lib/auth.ts
export const logoutAdmin = () => {
  // Clear admin session cookie (handled by server, optional frontend trigger)
  document.cookie = "token=; Max-Age=0; path=/"; // frontend-clearing fallback
  window.location.href = "/admin/login";
};
