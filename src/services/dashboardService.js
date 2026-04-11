import { request } from './apiClient.js';

export const dashboardService = {
  summary() {
    return request('/dashboard/summary');
  },
  activity() {
    return request('/dashboard/activity');
  },
  issueTrends() {
    return request('/dashboard/issue-trends');
  },
};
