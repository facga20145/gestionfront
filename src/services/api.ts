import axios from 'axios';
import type { Product, Supplier, Quote, Sale, User } from '../types';
import { API_CONFIG } from '../config/api.config';

const API_URL = API_CONFIG.baseURL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT a todas las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==================== USERS ====================
export const usersService = {
  getAll: async () => {
    const response = await api.get('/user');
    return response.data;
  },
  
  getPaginated: async (params?: { index?: number; limit?: number; search?: string }) => {
    const response = await api.get('/user/paginated', { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/user/${id}`);
    return response.data;
  },
  
  updateStatus: async (id: string, status: boolean) => {
    return await api.patch(`/user/${id}/status`, { status });
  },
};

// ==================== AUTH ====================
export const authService = {
  login: async (email: string, password: string) => {
    console.log('🔄 Login request:', { email, url: `${API_URL}/auth/login` });
    try {
      const response = await api.post('/auth/login', { email, password });
      console.log('✅ Login response:', response.data);
      if (response.data.data?.access_token) {
        localStorage.setItem('token', response.data.data.access_token);
      }
      return response.data;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  },
  
  register: async (data: any) => {
    console.log('🔄 Register request:', data, { url: `${API_URL}/auth/register` });
    try {
      const response = await api.post('/auth/register', data);
      console.log('✅ Register response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Register error:', error);
      throw error;
    }
  },
};

// ==================== PRODUCTS ====================
export const productsService = {
  getAll: async () => {
    const response = await api.get('/products');
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  
  create: async (data: Partial<Product>) => {
    return await api.post('/products', data);
  },
  
  update: async (id: number, data: Partial<Product>) => {
    return await api.patch(`/products/${id}`, data);
  },
  
  delete: async (id: number) => {
    return await api.delete(`/products/${id}`);
  },
};

// ==================== SUPPLIERS ====================
export const suppliersService = {
  getAll: async () => {
    const response = await api.get('/suppliers');
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/suppliers/${id}`);
    return response.data;
  },
  
  create: async (data: Partial<Supplier>) => {
    return await api.post('/suppliers', data);
  },
  
  update: async (id: number, data: Partial<Supplier>) => {
    return await api.patch(`/suppliers/${id}`, data);
  },
  
  delete: async (id: number) => {
    return await api.delete(`/suppliers/${id}`);
  },
};

// ==================== QUOTES ====================
export const quotesService = {
  getAll: async () => {
    const response = await api.get('/quotes');
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/quotes/${id}`);
    return response.data;
  },
  
  create: async (data: any) => {
    return await api.post('/quotes', data);
  },
  
  update: async (id: number, data: any) => {
    return await api.patch(`/quotes/${id}`, data);
  },
  
  delete: async (id: number) => {
    return await api.delete(`/quotes/${id}`);
  },
  
  sendEmail: async (data: any) => {
    return await api.post('/quotes/send-email', data);
  },
};

// ==================== SALES ====================
export const salesService = {
  getAll: async () => {
    const response = await api.get('/sales');
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/sales/${id}`);
    return response.data;
  },
  
  create: async (data: any) => {
    return await api.post('/sales', data);
  },
};

export default api;

