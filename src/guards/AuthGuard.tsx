import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_CONFIG } from '../config/api.config';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = sessionStorage.getItem('token');
    
    if (!token) {
      sessionStorage.removeItem('token');
      navigate('/login');
      return;
    }

    // Validar token con el backend
    try {
      const response = await fetch(`${API_CONFIG.baseURL}/products?limit=1`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Token inválido');
      }

      setIsAuthenticated(true);
    } catch (error) {
      sessionStorage.removeItem('token');
      navigate('/login');
      return;
    }
    
    setIsLoading(false);
  };

  // Mostrar loading mientras verifica
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no renderizar hijos
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

