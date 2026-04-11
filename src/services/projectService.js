import { request } from './apiClient.js';

export const projectService = {
  list() {
    return request('/projects');
  },

  create(payload) {
    return request('/projects', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  support(id, amount = 100) {
    return request(`/projects/${id}/support`, {
      method: 'PUT',
      body: JSON.stringify({ amount }),
    });
  },

  approve(id) {
    return request(`/projects/${id}/approve`, {
      method: 'PUT',
    });
  },

  reject(id) {
    return request(`/projects/${id}/reject`, {
      method: 'PUT',
    });
  },
};
