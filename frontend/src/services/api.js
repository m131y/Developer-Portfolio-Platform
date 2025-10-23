// Utility functions for API calls with authentication.
// Uses the JWT token stored in localStorage to set the Authorization header.

/**
 * Retrieve the JWT token from local storage.
 * @returns {string|null} the stored token or null if not present
 */
export function getToken() {
  return localStorage.getItem("jwt_token");
}

/**
 * Perform a fetch request with optional Bearer token and JSON handling.
 *
 * This helper automatically attaches the `Authorization: Bearer <token>` header
 * when a token is present in localStorage. It also converts plain object
 * bodies into JSON strings and sets the `Content-Type` header accordingly.
 *
 * @param {string} url relative URL starting with '/api'
 * @param {object} options fetch options (method, headers, body, etc.)
 * @returns {Promise<Response>} the fetch response
 */
export async function fetchWithAuth(url, options = {}) {
  const token = getToken();
  const headers = {
    ...(options.headers || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  // Automatically set JSON content type for plain object bodies
  if (options.body && typeof options.body === "object" && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(options.body);
  }
  const response = await fetch(url, {
    ...options,
    headers,
  });
  return response;
}