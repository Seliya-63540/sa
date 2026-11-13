/**
 * SAFAR CYCLE - Central API Client Configuration
 * Base URL comes from VITE_API_BASE_URL as instructed in Section 44.
 * In development / mock mode, calls route through mock service adapter.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
export const USE_MOCK = true; // Toggle to false when connecting to a live backend

export async function apiClient(endpoint, { data, method = 'GET', headers = {} } = {}) {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include', // Session cookies support
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return response.json();
}
