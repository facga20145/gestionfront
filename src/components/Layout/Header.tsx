import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-purple-600 font-bold text-xl">🚗</span>
            </div>
            <h1 className="text-2xl font-bold">AUTOMOTIVE OS</h1>
          </div>
          <nav className="flex space-x-4">
            <NavLink
              to="/"
              className="px-4 py-2 hover:bg-purple-700 rounded-lg transition"
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/products"
              className="px-4 py-2 hover:bg-purple-700 rounded-lg transition"
            >
              Productos
            </NavLink>
            <NavLink
              to="/quotes"
              className="px-4 py-2 hover:bg-purple-700 rounded-lg transition"
            >
              Cotizaciones
            </NavLink>
            <NavLink
              to="/sales"
              className="px-4 py-2 hover:bg-purple-700 rounded-lg transition"
            >
              Ventas
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}

function NavLink({ to, className, children }: any) {
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}

