import axios from 'axios';

const API_BASE_URL = '/api';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/login`, {
        email,
        password,
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error en la petición' };
    }
  },

  register: async (userName, email, password, confirmPassword) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/register`, {
        userName,
        email,
        password,
        confirmPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Error en la petición' };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken: () => localStorage.getItem('token'),
  
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => !!localStorage.getItem('token'),
};

// Configurar interceptor para agregar token a las peticiones
axios.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
