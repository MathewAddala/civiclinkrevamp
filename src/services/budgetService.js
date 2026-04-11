import { request } from './apiClient.js';

export const budgetService = {
  current() {
    return request('/budget/current');
  },
  proposals() {
    return request('/budget/proposals');
  },
  submitProposal(payload) {
    return request('/budget/proposals', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  approveProposal(id) {
    return request(`/budget/proposals/${id}/approve`, {
      method: 'PUT',
    });
  },

  approveAverage() {
    return request('/budget/approve-average', {
      method: 'PUT',
    });
  },

  overrideCurrent(payload) {
    return request('/budget/current', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
};
