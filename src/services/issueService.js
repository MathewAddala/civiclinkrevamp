import { request } from './apiClient.js';

export const issueService = {
  list() {
    return request('/issues');
  },

  create(payload) {
    if (payload?.attachment instanceof File) {
      const formData = new FormData();
      formData.append('title', payload.title);
      formData.append('location', payload.location);
      formData.append('description', payload.description || '');
      if (payload.lat !== undefined && payload.lat !== null) formData.append('lat', String(payload.lat));
      if (payload.lng !== undefined && payload.lng !== null) formData.append('lng', String(payload.lng));
      if (payload.priority) formData.append('priority', payload.priority);
      formData.append('attachment', payload.attachment);

      const token = localStorage.getItem('civiclinkToken');
      return fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/issues/with-attachment`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      }).then(async (res) => {
        const contentType = res.headers.get('content-type') || '';
        const data = contentType.includes('application/json') ? await res.json() : await res.text();
        if (!res.ok) {
          throw new Error((typeof data === 'object' && data?.message) || data || 'Request failed');
        }
        return data;
      });
    }
    return request('/issues', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update(id, payload) {
    return request(`/issues/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
};
