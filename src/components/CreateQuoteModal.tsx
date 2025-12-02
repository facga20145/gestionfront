import { useState, useEffect } from 'react';
import { productsService, quotesService } from '../services/api';
import type { Product } from '../types';
import { extractData } from '../utils/api-helper';

interface CreateQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateQuoteModal({ isOpen, onClose, onSuccess }: CreateQuoteModalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    clienteNombre: '',
    clienteEmail: '',
    items: [] as { productId: number; cantidad: number; precioUnitario: number; nombre: string }[]
  });
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen) {
      loadProducts();
    }
  }, [isOpen]);

  const loadProducts = async () => {
    try {
      console.log('🚀 Loading products in modal...');
      const response = await productsService.getAll();
      console.log('📦 Products response:', response);
      const list = extractData<Product>(response);
      console.log('✅ Extracted products list:', list);
      setProducts(list);
    } catch (error) {
      console.error('❌ Error loading products:', error);
    }
  };

  const handleAddItem = () => {
    if (!selectedProduct) return;
    const product = products.find(p => p.id === parseInt(selectedProduct));
    if (!product) return;

    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          productId: product.id,
          cantidad: quantity,
          precioUnitario: product.precio,
          nombre: product.nombre
        }
      ]
    });
    setSelectedProduct('');
    setQuantity(1);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await quotesService.create({
        clienteNombre: formData.clienteNombre,
        clienteEmail: formData.clienteEmail,
        items: formData.items.map(({ productId, cantidad, precioUnitario }) => ({
          productId,
          cantidad,
          precioUnitario
        }))
      });
      onSuccess();
      onClose();
      setFormData({ clienteNombre: '', clienteEmail: '', items: [] });
      alert('Cotización creada exitosamente');
    } catch (error) {
      console.error('Error creating quote:', error);
      alert('Error al crear la cotización');
    }
  };

  if (!isOpen) return null;

  const total = formData.items.reduce((acc, item) => acc + (item.cantidad * item.precioUnitario), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-white">
              📝 Nueva Cotización
            </h3>
            <button onClick={onClose} className="text-indigo-100 hover:text-white transition-colors">
              <span className="text-2xl">&times;</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cliente *</label>
                <input
                  type="text"
                  required
                  placeholder="Nombre del cliente"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  value={formData.clienteNombre}
                  onChange={e => setFormData({ ...formData, clienteNombre: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  placeholder="cliente@email.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  value={formData.clienteEmail}
                  onChange={e => setFormData({ ...formData, clienteEmail: e.target.value })}
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
              <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Agregar Productos</h4>
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-xs text-gray-500 mb-1">Producto</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    value={selectedProduct}
                    onChange={e => setSelectedProduct(e.target.value)}
                  >
                    <option value="">Seleccionar producto...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nombre} - ${p.precio} (Stock: {p.stock})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-full md:w-32">
                  <label className="block text-xs text-gray-500 mb-1">Cantidad</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={quantity}
                    onChange={e => setQuantity(parseInt(e.target.value))}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddItem}
                  disabled={!selectedProduct}
                  className="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  + Agregar
                </button>
              </div>
            </div>

            <div className="mb-8 overflow-hidden border border-gray-200 rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Producto</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Cant.</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Precio Unit.</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Subtotal</th>
                    <th className="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {formData.items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500 text-sm">
                        No hay productos agregados a la cotización
                      </td>
                    </tr>
                  ) : (
                    formData.items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-sm text-gray-800">{item.nombre}</td>
                        <td className="py-3 px-4 text-center text-sm text-gray-600">{item.cantidad}</td>
                        <td className="py-3 px-4 text-right text-sm text-gray-600">${item.precioUnitario.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right text-sm font-medium text-gray-800">${(item.cantidad * item.precioUnitario).toFixed(2)}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot className="bg-gray-50 border-t border-gray-200">
                  <tr>
                    <td colSpan={3} className="py-4 px-4 text-right font-bold text-gray-700">Total Estimado:</td>
                    <td className="py-4 px-4 text-right font-bold text-indigo-600 text-lg">${total.toFixed(2)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={formData.items.length === 0 || !formData.clienteNombre || !formData.clienteEmail}
              >
                Crear Cotización
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
