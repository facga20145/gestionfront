import { useEffect, useState } from 'react';
import { suppliersService } from '../services/api';
import type { Supplier } from '../types';
import Toast from '../components/Toast';

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
      
      // El backend devuelve paginado: data.items
      const suppliersList = response.data?.items || 
                            response.data?.data || 
                            (Array.isArray(response.data) ? response.data : []);
      
      console.log('Loaded suppliers:', suppliersList.length, suppliersList);
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Proveedores</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          + Nuevo Proveedor
        </button>
      </div>

      {/* Modal de Agregar Proveedor */}
      {showModal && (
        <>
          {/* Overlay con animación */}
          <div 
            className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 pointer-events-auto ${
              isClosing ? 'opacity-0' : 'opacity-30'
            }`}
            onClick={handleCloseModal}
          ></div>
          
          {/* Modal con animación */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <div 
              className={`pointer-events-auto w-full max-w-2xl max-h-[90vh] transition-all duration-300 ${
                isClosing 
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
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition transform hover:scale-110"
                  >
                    <span className="text-2xl">✕</span>
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                      />
                    </div>
                  </div>

                  {/* Footer con botones */}
                  <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition transform hover:scale-105"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition transform hover:scale-105 shadow-md"
                    >
                      ✓ Guardar Proveedor
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

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
                  <button 
                    onClick={() => handleOpenEdit(supplier)}
                    className="text-blue-600 hover:underline mr-3"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(supplier.id)}
                    className="text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
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

