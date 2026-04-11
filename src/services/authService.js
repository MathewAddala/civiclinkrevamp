import { request } from './apiClient.js';

export const authService = {
  login(credentials) {
    return request('/auth/login', {
      method: 'POST',
      includeAuth: false,
      body: JSON.stringify(credentials),
    });
  },

  register(payload) {
    return request('/auth/register', {
      method: 'POST',
      includeAuth: false,
      body: JSON.stringify(payload),
    });
  },

  getCurrentUser() {
    return request('/auth/me');
  },
};
