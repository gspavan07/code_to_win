const API_URL = 'http://192.168.133.84:5000/api';

export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  return fetch(url, options);
};
