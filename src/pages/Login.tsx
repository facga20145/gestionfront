import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import Toast from '../components/Toast';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Estados para Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Estados para Registro
  const [name, setName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Estados para Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.login(email, password);
      console.log('Login response:', response);
      if (response.status_code === 200 || response.access_token) {
        if (response.data?.access_token || response.access_token) {
          localStorage.setItem('token', response.data?.access_token || response.access_token);
          setToast({ message: '¡Inicio de sesión exitoso!', type: 'success' });
          setTimeout(() => navigate('/'), 1000);
        }
      }
    } catch (err: any) {
      console.error('Login error:', err);
      console.error('Error details:', err.response);
      const errorMessage = err.response?.data?.message || err.message || 'Error al iniciar sesión';
      setError(errorMessage);
      setToast({ message: errorMessage, type: 'error' });
      console.error('Error completo:', JSON.stringify(err.response?.data, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPasswordError('');
    setIsLoading(true);

    // Validar contraseñas
    if (registerPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden.');
      return;
    }

    if (registerPassword.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      const response = await authService.register({
        name,
        username: registerEmail,
        email: registerEmail,
        password: registerPassword,
        confirmPassword,
        rol: 'VENDEDOR',
      });

      if (response.status_code === 201 || response.statusCode === 201) {
        setToast({ message: '¡Usuario creado exitosamente!', type: 'success' });
        setTimeout(() => {
          setIsRegister(false);
          // Limpiar campos
          setName('');
          setRegisterEmail('');
          setRegisterPassword('');
          setConfirmPassword('');
        }, 1500);
      }
    } catch (err: any) {
      console.error('Register error:', err);
      console.error('Error details:', err.response);
      const errorMessage = err.response?.data?.message || err.message || 'Error al registrar usuario';
      setError(errorMessage);
      setToast({ message: errorMessage, type: 'error' });
      console.error('Error completo:', JSON.stringify(err.response?.data, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const validatePassword = (pass: string) => {
    if (pass.length > 0 && pass.length < 6) {
      return 'Mínimo 6 caracteres.';
    }
    if (pass.includes(' ')) {
      return 'La contraseña no puede contener espacios.';
    }
    return '';
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Panel Izquierdo - Branding */}
      <div className="w-1/2 bg-gradient-to-br from-blue-900 to-blue-700 text-white hidden md:flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-24 h-24 bg-amber-100 rounded-lg mx-auto mb-6 flex items-center justify-center">
            <span className="text-5xl">🔧</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">Representaciones Forzaba</h1>
          <p className="text-xl text-blue-100">Gestión de Almacén de Piezas de Automóviles</p>
        </div>
      </div>

      {/* Panel Derecho - Formulario */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {isRegister ? 'Crear Nueva Cuenta' : 'BIENVENIDO'}
          </h2>
          <p className="text-gray-600 mb-8">
            {isRegister
              ? 'Introduce tus datos para registrarte en el sistema.'
              : 'Introduce tus credenciales para acceder al sistema'}
          </p>

          {isRegister ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">👤</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Introduce tu nombre y apellidos"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">📧</span>
                  <input
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ejemplo@correo.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Introduce tu contraseña"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres, sin espacios.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔒</span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordError('');
                    }}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      passwordError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Vuelve a introducir la contraseña"
                    required
                  />
                  {passwordError && (
                    <span className="absolute right-10 top-1/2 transform -translate-y-1/2 text-red-500">✕</span>
                  )}
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-xs text-red-600 mt-1">{passwordError}</p>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(false);
                    setError('');
                    setPasswordError('');
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ¿Ya tienes una cuenta? <span className="font-semibold">Inicia sesión</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usuario / Email
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">👤</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Introduce tu email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔒</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Introduce tu contraseña"
                    required
                  />
                  <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    👁️
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>

              <div className="text-center text-sm text-gray-500 mb-4">
                ¿Olvidaste tu contraseña?
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ¿No tienes una cuenta? <span className="font-semibold">Regístrate</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Footer */}
      <div className="absolute bottom-0 right-0 m-4 text-gray-500 text-sm hidden md:block">
        © 2024 Representaciones Forzaba. Todos los derechos reservados.
      </div>
    </div>
  );
}
