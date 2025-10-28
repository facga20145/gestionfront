import { useEffect, useState } from 'react';
import { quotesService } from '../services/api';
import type { Quote } from '../types';

export default function Quotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      const response = await quotesService.getAll();
      
      // Asegurarse de que siempre sea un array
      const quotesList = Array.isArray(response.data?.data)
        ? response.data.data
        : Array.isArray(response.data)
        ? response.data
        : Array.isArray(response)
        ? response
        : [];
        
      setQuotes(quotesList);
    } catch (error) {
      console.error('Error loading quotes:', error);
      setQuotes([]); // Asegurar que sea array vacío en caso de error
    }
  };

  const getEstadoColor = (estado: string) => {
    const colors: any = {
      PENDIENTE: 'bg-yellow-100 text-yellow-800',
      ENVIADA: 'bg-blue-100 text-blue-800',
      ACEPTADA: 'bg-green-100 text-green-800',
      RECHAZADA: 'bg-red-100 text-red-800',
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Cotizaciones</h2>
        <button className="btn-primary">
          + Nueva Cotización
        </button>
      </div>

      <div className="card mb-6">
        <input
          type="text"
          placeholder="Buscar cotización..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field"
        />
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Código</th>
              <th className="px-4 py-3 text-left">Cliente</th>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((quote) => (
              <tr key={quote.id} className="border-b">
                <td className="px-4 py-3 font-bold">{quote.codigo}</td>
                <td className="px-4 py-3">{quote.clienteNombre}</td>
                <td className="px-4 py-3">{new Date(quote.fecha).toLocaleDateString()}</td>
                <td className="px-4 py-3 font-bold">${quote.total}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getEstadoColor(quote.estado)}`}>
                    {quote.estado}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-blue-600 hover:underline mr-3">Ver</button>
                  <button className="text-green-600 hover:underline mr-3">Enviar Email</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {quotes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay cotizaciones disponibles
          </div>
        )}
      </div>

      <div className="mt-4 text-gray-600">
        Total de cotizaciones: {quotes.length}
      </div>
    </div>
  );
}

