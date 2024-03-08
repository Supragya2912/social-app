import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});

let isRefreshingToken = false;

axiosInstance.interceptors.response.use(
  response => response, // Simply return the response if it's successful
  async error => {
    const originalRequest = error.config;
    console.log('Retry',  originalRequest._retry, window.location.pathname);
    const currentPath = window.location.pathname;
    const isUnauthenticatedPath = currentPath === '/login' || currentPath === '/register' || currentPath === '/';

    if (error.response && error.response.status === 401 && !isRefreshingToken && !isUnauthenticatedPath) {
      try {
        isRefreshingToken = true;
        await axiosInstance.post(`/auth/refresh-token`);
        return axiosInstance(originalRequest);
      } catch (e) {
        return Promise.reject(e);
      }
    }

    if (error.response && error.response.status === 401 && isRefreshingToken) {
      isRefreshingToken = false;
      if (!isUnauthenticatedPath) {
        window.location.href = '/login';
      }
      return;
    }

    return Promise.reject(error);
  }
);

export const loginApi = async (data) => axiosInstance.post(`/auth/login`, data);
export const registerApi = async (data) => axiosInstance.post(`/auth/register`, data);
export const logoutApi = async (data) => axiosInstance.post(`/auth/logout`, data);
export const meApi = async (data) => axiosInstance.get(`/auth/me`, data);
export const getPosts = async ({page, limit}) => axiosInstance.get(`/posts/get-posts?page=${page}&limit=${limit}`);
export const getPostById = async (id) => axiosInstance.get(`/posts/get-post?id=${id}`);
export const addLike = async (data) => axiosInstance.post(`/posts/like`, data);
export const updateUser = async (data) => axiosInstance.post(`/users/update-user`, data);
export const getUser = async (data) => axiosInstance.get(`/users/get-user`, data);
