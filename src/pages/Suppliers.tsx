import { useEffect, useState } from 'react';
import { suppliersService } from '../services/api';
import type { Supplier } from '../types';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const response = await suppliersService.getAll();
      console.log('Suppliers response:', response);
      setSuppliers(response.data?.data || response.data || []);
    } catch (error) {
      console.error('Error loading suppliers:', error);
    }
  };

  const filteredSuppliers = suppliers.filter((s) =>
    s.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Proveedores</h2>
        <button className="btn-primary">
          + Nuevo Proveedor
        </button>
      </div>

      <div className="card mb-6">
        <input
          type="text"
          placeholder="Buscar proveedor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field"
        />
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Teléfono</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Dirección</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map((supplier) => (
              <tr key={supplier.id} className="border-b">
                <td className="px-4 py-3">{supplier.id}</td>
                <td className="px-4 py-3">{supplier.nombre}</td>
                <td className="px-4 py-3">{supplier.telefono || '-'}</td>
                <td className="px-4 py-3">{supplier.email || '-'}</td>
                <td className="px-4 py-3">{supplier.direccion || '-'}</td>
                <td className="px-4 py-3">
                  <button className="text-blue-600 hover:underline mr-3">Editar</button>
                  <button className="text-red-600 hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredSuppliers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay proveedores disponibles
          </div>
        )}
      </div>

      <div className="mt-4 text-gray-600">
        Total de proveedores: {filteredSuppliers.length}
      </div>
    </div>
  );
}

