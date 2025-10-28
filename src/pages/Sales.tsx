import { useEffect, useState } from 'react';
import { salesService } from '../services/api';
import type { Sale } from '../types';

export default function Sales() {
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      const response = await salesService.getAll();
      
      // Asegurarse de que siempre sea un array
      const salesList = Array.isArray(response.data?.data)
        ? response.data.data
        : Array.isArray(response.data)
        ? response.data
        : Array.isArray(response)
        ? response
        : [];
        
      setSales(salesList);
    } catch (error) {
      console.error('Error loading sales:', error);
      setSales([]); // Asegurar que sea array vacío en caso de error
    }
  };

  const getPaymentMethod = (method: string) => {
    const methods: any = {
      EFECTIVO: '💵 Efectivo',
      TRANSFERENCIA: '🏦 Transferencia',
      TARJETA: '💳 Tarjeta',
      CREDITO: '📝 Crédito',
    };
    return methods[method] || method;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Ventas</h2>
        <button className="btn-primary">
          + Nueva Venta
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Cliente</th>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Método Pago</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="border-b">
                <td className="px-4 py-3">{sale.id}</td>
                <td className="px-4 py-3">{sale.clienteNombre}</td>
                <td className="px-4 py-3">{new Date(sale.fecha).toLocaleDateString()}</td>
                <td className="px-4 py-3 font-bold">${sale.total}</td>
                <td className="px-4 py-3">{getPaymentMethod(sale.metodoPago)}</td>
                <td className="px-4 py-3">
                  <button className="text-blue-600 hover:underline">Ver Detalle</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sales.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay ventas registradas
          </div>
        )}
      </div>

      <div className="mt-4 text-gray-600">
        Total de ventas: {sales.length}
      </div>
    </div>
  );
}

