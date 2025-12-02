import { useEffect, useState } from 'react';
import { suppliersService } from '../services/api';
import type { Supplier } from '../types';
import Toast from '../components/Toast';
import { extractData } from '../utils/api-helper';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
  });

  useEffect(() => {
    loadSuppliers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSuppliers = async () => {
    try {
      const response = await suppliersService.getAll();
      const suppliersList = extractData<Supplier>(response);
      setSuppliers(suppliersList);
    } catch (error) {
      console.error('Error loading suppliers:', error);
      setSuppliers([]);
    }
  };

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setIsClosing(false);
      setEditingSupplier(null);
      setFormData({ nombre: '', telefono: '', email: '', direccion: '' });
    }, 300);
  };

  const handleOpenEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      nombre: supplier.nombre,
      telefono: supplier.telefono || '',
      email: supplier.email || '',
      direccion: supplier.direccion || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este proveedor?')) return;

    try {
      await suppliersService.delete(id);
      setToast({ message: '✅ Proveedor eliminado exitosamente', type: 'success' });
      loadSuppliers();
    } catch (error) {
      setToast({ message: '❌ Error al eliminar proveedor', type: 'error' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSupplier) {
        await suppliersService.update(editingSupplier.id, formData);
        setToast({ message: '✅ Proveedor actualizado exitosamente', type: 'success' });
      } else {
        await suppliersService.create(formData);
        setToast({ message: '✅ Proveedor guardado exitosamente', type: 'success' });
      }

      handleCloseModal();
      setSearch('');
      setTimeout(() => {
        loadSuppliers();
      }, 600);
      setFormData({ nombre: '', telefono: '', email: '', direccion: '' });
      setEditingSupplier(null);
    } catch (error) {
      console.error('Error saving supplier:', error);
      setToast({ message: '❌ Error al guardar proveedor', type: 'error' });
    }
  };

  // Filtrar solo si suppliers es un array
  const filteredSuppliers = Array.isArray(suppliers)
    ? suppliers.filter((s) => s.nombre.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Proveedores</h2>
          <p className="text-gray-500 mt-1">Gestiona tus relaciones con proveedores y contactos</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-medium"
        >
          <span className="text-xl">+</span> Nuevo Proveedor
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="relative max-w-md">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Buscar por nombre, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4 text-left">Proveedor</th>
                <th className="px-6 py-4 text-left">Contacto</th>
                <th className="px-6 py-4 text-left">Dirección</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-green-50/30 transition-colors duration-200 group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">{supplier.nombre}</span>
                      <span className="text-xs text-gray-500 mt-0.5">ID: {supplier.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {supplier.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>📧</span> {supplier.email}
                        </div>
                      )}
                      {supplier.telefono && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>📞</span> {supplier.telefono}
                        </div>
                      )}
                      {!supplier.email && !supplier.telefono && <span className="text-gray-400 text-sm">-</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {supplier.direccion || '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => handleOpenEdit(supplier)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(supplier.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredSuppliers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏢</div>
              <h3 className="text-lg font-medium text-gray-900">No se encontraron proveedores</h3>
              <p className="text-gray-500 mt-1">Intenta con otra búsqueda o agrega un nuevo proveedor.</p>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 text-sm text-gray-500 flex justify-between items-center">
          <span>Mostrando {filteredSuppliers.length} proveedores</span>
          <span>Página 1 de 1</span>
        </div>
      </div>

      {/* Modal de Agregar Proveedor */}
      {showModal && (
        <>
          <div
            className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'
              }`}
            onClick={handleCloseModal}
          ></div>

          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <div
              className={`pointer-events-auto w-full max-w-2xl max-h-[90vh] transition-all duration-300 ${isClosing
                  ? 'opacity-0 transform scale-95 translate-y-4'
                  : 'opacity-100 transform scale-100 translate-y-0'
                }`}
            >
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-xl flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold">
                      {editingSupplier ? '✏️ Editar Proveedor' : '🏢 Nuevo Proveedor'}
                    </h3>
                    <p className="text-green-100 text-sm mt-1">
                      {editingSupplier ? 'Modificar información del proveedor' : 'Agregar un nuevo proveedor al sistema'}
                    </p>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-2 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        🏢 Nombre del Proveedor *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        placeholder="Ej: ABC Autopartes..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition"
                      />
                    </div>

                    {/* Teléfono */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        📞 Teléfono
                      </label>
                      <input
                        type="tel"
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        placeholder="Ej: 555-1234..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        📧 Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Ej: proveedor@email.com..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition"
                      />
                    </div>

                    {/* Dirección */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        📍 Dirección
                      </label>
                      <input
                        type="text"
                        value={formData.direccion}
                        onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                        placeholder="Ej: Av. Principal 123..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition"
                      />
                    </div>
                  </div>

                  {/* Footer con botones */}
                  <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 shadow-lg hover:shadow-green-600/30 transition-all transform hover:-translate-y-0.5"
                    >
                      {editingSupplier ? 'Guardar Cambios' : 'Guardar Proveedor'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
