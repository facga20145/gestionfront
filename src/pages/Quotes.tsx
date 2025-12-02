import { useEffect, useState } from 'react';
import { quotesService } from '../services/api';
import type { Quote } from '../types';
import CreateQuoteModal from '../components/CreateQuoteModal';
import { extractData } from '../utils/api-helper';
import LoadingSpinner from '../components/LoadingSpinner';
import { Plus, Search, Eye } from 'lucide-react';

export default function Quotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      setIsLoading(true);
      const response = await quotesService.getAll();
      const quotesList = extractData<Quote>(response);
      setQuotes(quotesList);
    } catch (error) {
      console.error('Error loading quotes:', error);
      setQuotes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getEstadoColor = (estado: string) => {
    const colors: any = {
      PENDIENTE: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      ENVIADA: 'bg-blue-100 text-blue-800 border-blue-200',
      ACEPTADA: 'bg-green-100 text-green-800 border-green-200',
      RECHAZADA: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[estado] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Filtrar cotizaciones
  const filteredQuotes = Array.isArray(quotes)
    ? quotes.filter((q) =>
      q.clienteNombre.toLowerCase().includes(search.toLowerCase()) ||
      q.codigo.toLowerCase().includes(search.toLowerCase())
    )
    : [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Cotizaciones</h2>
          <p className="text-gray-500 mt-1">Gestiona presupuestos y envíos a clientes</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" /> Nueva Cotización
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por cliente o código..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <table className="w-full">
                <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-4 text-left">Código</th>
                    <th className="px-6 py-4 text-left">Cliente</th>
                    <th className="px-6 py-4 text-left">Fecha</th>
                    <th className="px-6 py-4 text-left">Total</th>
                    <th className="px-6 py-4 text-left">Estado</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredQuotes.map((quote) => (
                    <tr key={quote.id} className="hover:bg-indigo-50/30 transition-colors duration-200 group">
                      <td className="px-6 py-4">
                        <span className="font-mono font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                          {quote.codigo}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-800">{quote.clienteNombre}</span>
                          <span className="text-xs text-gray-500 mt-0.5">{quote.clienteEmail}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(quote.fecha).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-800">
                          ${quote.total.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getEstadoColor(quote.estado)}`}>
                          {quote.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Ver detalle (próximamente)">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredQuotes.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900">No se encontraron cotizaciones</h3>
                  <p className="text-gray-500 mt-1">Intenta con otra búsqueda o crea una nueva cotización.</p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 text-sm text-gray-500 flex justify-between items-center">
          <span>Mostrando {filteredQuotes.length} cotizaciones</span>
          <span>Página 1 de 1</span>
        </div>
      </div>

      <CreateQuoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadQuotes}
      />
    </div>
  );
}
