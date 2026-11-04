const runtimeBaseUrl =
  typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.hostname}:5000`
    : "";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || runtimeBaseUrl || ""
).replace(/\/$/, "");

export const apiUrl = (path) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};