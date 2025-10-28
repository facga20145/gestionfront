import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-900 font-bold text-xl">🔧</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Representaciones Forzaba</h1>
              <p className="text-xs text-blue-200">Gestión de Almacén</p>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <input
              type="text"
              placeholder="Buscar piezas o pedidos..."
              className="w-full px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center space-x-4">
            {/* User Menu */}
            <div className="relative">
              <button 
                onClick={toggleMenu}
                className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-900 transition"
              >
                <span className="text-xl">👤</span>
              </button>
              
              {/* Dropdown Menu */}
              {showMenu && (
                <>
                  {/* Overlay para cerrar al hacer clic fuera */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowMenu(false)}
                  ></div>
                  
                  {/* Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50">
                    <div className="py-2">
                      <button 
                        onClick={() => {
                          setShowMenu(false);
                          // Aquí puedes agregar la acción de perfil
                        }}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <span>👤</span> Mi Perfil
                      </button>
                      <button 
                        onClick={() => {
                          setShowMenu(false);
                          // Aquí puedes agregar la acción de configuración
                        }}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <span>⚙️</span> Configuración
                      </button>
                      <div className="border-t border-gray-200 my-1"></div>
                      <button 
                        onClick={() => {
                          setShowMenu(false);
                          handleLogout();
                        }}
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <span>🚪</span> Cerrar Sesión
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

