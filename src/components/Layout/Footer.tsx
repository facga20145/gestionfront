export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          <p className="text-sm">Sistema de Gestión de Almacén © 2024</p>
          <p className="text-sm">Última actualización: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </footer>
  );
}

