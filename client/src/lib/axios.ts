import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const skipRedirect =
      error.config?.headers?.['x-skip-auth-redirect'];

    if (
      error.response?.status === 401 &&
      !skipRedirect &&
      typeof window !== 'undefined'
    ) {
      if (!window.location.pathname.includes('/login')) {
        window.location.href = `/login?redirect=${encodeURIComponent(
          window.location.pathname
        )}`;
      }
    }

    return Promise.reject(error);
  }
);

export default api;