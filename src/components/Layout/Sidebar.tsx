import { Link } from 'react-router-dom';

export default function Sidebar() {
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/products', label: 'Productos', icon: '📦' },
    { path: '/suppliers', label: 'Proveedores', icon: '🏢' },
    { path: '/quotes', label: 'Cotizaciones', icon: '📝' },
    { path: '/sales', label: 'Ventas', icon: '💰' },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

