import { apiClient } from './apiClient.js';

export const authApi = {
  /**
   * Fetch session-bound CSRF token
   */
  async getCsrf() {
    const res = await apiClient('/auth/csrf');
    return res?.csrfToken || res?.data?.csrfToken;
  },

  /**
   * Register a new customer
   */
  async register({ name, fullName, phone, password, preferredLanguage = 'gu' }) {
    const res = await apiClient('/auth/register', {
      method: 'POST',
      data: {
        fullName: fullName || name,
        phone,
        password,
        preferredLanguage
      }
    });
    return res?.user || res?.data?.user || res;
  },

  /**
   * Authenticate customer or admin
   */
  async login(identifier, password, portal = null) {
    const res = await apiClient('/auth/login', {
      method: 'POST',
      data: {
        identifier,
        password,
        portal
      }
    });
    return res?.user || res?.data?.user || res;
  },

  /**
   * Terminate active session
   */
  async logout() {
    return apiClient('/auth/logout', { method: 'POST' });
  },

  /**
   * Fetch current authenticated profile
   */
  async getMe() {
    const res = await apiClient('/auth/me');
    return res?.user || res?.data?.user || res;
  }
};
