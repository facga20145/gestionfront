// Configuración de la API
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4001/api',
  timeout: 10000,
};

console.log('🔧 API Config:', API_CONFIG);

