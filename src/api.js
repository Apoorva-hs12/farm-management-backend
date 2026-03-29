// API helper to communicate with backend
const API_URL = 'http://localhost:4000/api';

export function getToken() {
  return localStorage.getItem('gokulam_token');
}

export function setToken(token, user) {
  if (token) localStorage.setItem('gokulam_token', token);
  if (user) localStorage.setItem('gokulam_user', JSON.stringify(user));
}

export function clearToken() {
  localStorage.removeItem('gokulam_token');
  localStorage.removeItem('gokulam_user');
}

export function getUser() {
  const u = localStorage.getItem('gokulam_user');
  return u ? JSON.parse(u) : null;
}

export function setUser(user) {
  if (user) localStorage.setItem('gokulam_user', JSON.stringify(user));
}

export async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  
  if (response.status === 401 || response.status === 403) {
    clearToken();
    window.location.hash = '';
    if (window.navigate) window.navigate('login');
    throw new Error('Unauthorized');
  }

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'API Request Failed');
  }
  
  return data;
}
