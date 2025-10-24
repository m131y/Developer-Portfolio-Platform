import StorageService from "./storage";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * Fetch wrapper with automatic authentication
 * @param {string} url - API endpoint URL (relative or absolute)
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<Response>}
 */
export const fetchWithAuth = async (url, options = {}) => {
  const token = StorageService.getAccessToken();

  // Prepare headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add Authorization header if token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Build full URL
  const fullUrl = url.startsWith("http") ? url : `${API_URL}${url}`;

  // Make the request
  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized
  if (response.status === 401) {
    StorageService.clear();
    window.location.href = "/login";
  }

  return response;
};