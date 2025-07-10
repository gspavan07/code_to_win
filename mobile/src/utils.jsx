const API_URL = 'http://192.168.1.12:5000/api';

export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};
