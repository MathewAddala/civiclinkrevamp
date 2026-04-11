const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const getToken = () => localStorage.getItem('civiclinkToken');

const buildHeaders = (customHeaders = {}, includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

export async function request(endpoint, options = {}) {
  const { includeAuth = true, headers = {}, ...rest } = options;
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...rest,
    headers: buildHeaders(headers, includeAuth),
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      (typeof payload === 'object' && payload?.message) ||
      (typeof payload === 'string' && payload) ||
      'Request failed';
    throw new Error(message);
  }

  return payload;
}
