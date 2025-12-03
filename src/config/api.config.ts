// Configuración de la API
const getBaseURL = () => {
  const envURL = import.meta.env.VITE_API_URL;
  if (envURL) {
    // Si la URL de entorno termina con /api, usarla tal cual
    // Si no, agregar /api al final
    return envURL.endsWith('/api') ? envURL : `${envURL}/api`;
  }
  // Fallback por defecto - apunta a localhost para desarrollo
  return 'http://localhost:4001/api';
};

export const API_CONFIG = {
  baseURL: getBaseURL(),
  timeout: 60000, // 60 segundos para permitir tiempo de envío de correo
};

