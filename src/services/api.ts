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
  const token = sessionStorage.getItem('token');
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
  // Verificar si el token es válido
  verifyToken: async () => {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  login: async (username: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      
      // El backend envuelve con { statusCode, message, data }
      // Y el access_token está en response.data.data.access_token
      if (response.data?.data?.access_token) {
        sessionStorage.setItem('token', response.data.data.access_token);
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  },
  
  register: async (data: any) => {
    try {
      const response = await api.post('/auth/register', data);
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
    console.log('🔍 Suppliers API Response:', response.data);
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
  
  // Enviar email de una cotización por ID
  sendEmail: async (id: number) => {
    return await api.post(`/quotes/${id}/send-email`, {});
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

