import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3006/api',
  withCredentials: false
});
// Stub auth headers for MVP
api.interceptors.request.use(cfg => {
  cfg.headers['x-user-id'] = localStorage.getItem('uid') || 'demo-user-id';
  cfg.headers['x-user-role'] = 'BUYER';
  return cfg;
});
export default api;
