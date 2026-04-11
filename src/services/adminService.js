import { request } from './apiClient.js';

export const adminService = {
  votingEventStatus() {
    return request('/admin/voting-event');
  },
  startVotingEvent(payload) {
    return request('/admin/voting-event/start', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  stopVotingEvent() {
    return request('/admin/voting-event/stop', {
      method: 'POST',
    });
  },
  listUsers() {
    return request('/admin/users');
  },
  promoteUser(id) {
    return request(`/admin/users/${id}/promote`, {
      method: 'PUT',
    });
  },
};
