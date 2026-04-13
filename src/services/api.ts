import axios from 'axios';
import { useAuth } from '@/store/use-auth';
import config from '@/config';

const api = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAuth.getState().tokens?.access.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthRoute = originalRequest.url?.includes('/auth/login') || 
                      originalRequest.url?.includes('/auth/register') ||
                      originalRequest.url?.includes('/auth/refresh-tokens');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;
      try {
        const refreshToken = useAuth.getState().tokens?.refresh.token;
        const response = await axios.post(`${api.defaults.baseURL}/auth/refresh-tokens`, {
          refreshToken,
        });
        const { access, refresh } = response.data.data;
        const authState = useAuth.getState();
        if (!authState.user) {
          throw new Error('Session invalid: User data missing');
        }
        
        useAuth.getState().setAuth(authState.user, { access, refresh });
        originalRequest.headers.Authorization = `Bearer ${access.token}`;
        return api(originalRequest);
      } catch (err) {
        useAuth.getState().logout();
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
