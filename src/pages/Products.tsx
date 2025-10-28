import { useEffect, useState } from 'react';
import { productsService, suppliersService } from '../services/api';
import type { Product, Supplier } from '../types';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setIsClosing(false);
    }, 300);
  };
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria: '',
    proveedorId: '',
  });

  useEffect(() => {
    loadProducts();
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const response = await suppliersService.getAll();
      const suppliersList = Array.isArray(response.data?.data)
        ? response.data.data
        : Array.isArray(response.data)
        ? response.data
        : [];
      setSuppliers(suppliersList);
    } catch (error) {
      console.error('Error loading suppliers:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await productsService.getAll();
      
      // Asegurarse de que siempre sea un array
      const productsList = Array.isArray(response.data?.data)
        ? response.data.data
        : Array.isArray(response.data)
        ? response.data
        : Array.isArray(response)
        ? response
        : [];
        
      setProducts(productsList);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]); // Asegurar que sea array vacío en caso de error
    }
  };

  // Filtrar solo si products es un array
  const filteredProducts = Array.isArray(products) 
    ? products.filter((p) => p.nombre.toLowerCase().includes(search.toLowerCase()))
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await productsService.create(formData);
      handleCloseModal(); // Usar función con animación
      loadProducts(); // Recargar productos
      setFormData({ nombre: '', descripcion: '', precio: '', stock: '', categoria: '', proveedorId: '' });
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Productos</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          + Nuevo Producto
        </button>
      </div>

      {/* Modal de Agregar Producto */}
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
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold">📦 Nuevo Producto</h3>
                  <p className="text-blue-100 text-sm mt-1">Agregar un nuevo producto al inventario</p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition transform hover:scale-110"
                >
                  <span className="text-2xl">✕</span>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nombre */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📝 Nombre del Producto *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      placeholder="Ej: Filtro de Aceite..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>

                  {/* Descripción */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📄 Descripción
                    </label>
                    <textarea
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      placeholder="Descripción del producto..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>

                  {/* Precio */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      💰 Precio *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        required
                        step="0.01"
                        value={formData.precio}
                        onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                        placeholder="0.00"
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      />
                    </div>
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📦 Stock *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      placeholder="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>

                  {/* Categoría */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      🏷️ Categoría
                    </label>
                    <input
                      type="text"
                      value={formData.categoria}
                      onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                      placeholder="Ej: Frenos, Motor, Suspensión..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>

                  {/* Proveedor */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      🏢 Proveedor *
                    </label>
                    <select
                      required
                      value={formData.proveedorId}
                      onChange={(e) => setFormData({ ...formData, proveedorId: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    >
                      <option value="">Seleccione un proveedor...</option>
                      {suppliers.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.nombre}
                        </option>
                      ))}
                    </select>
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
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition transform hover:scale-105 shadow-md"
                  >
                    ✓ Guardar Producto
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
          placeholder="Buscar producto..."
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
              <th className="px-4 py-3 text-left">Precio</th>
              <th className="px-4 py-3 text-left">Stock</th>
              <th className="px-4 py-3 text-left">Categoría</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="px-4 py-3">{product.id}</td>
                <td className="px-4 py-3">{product.nombre}</td>
                <td className="px-4 py-3">${product.precio}</td>
                <td className="px-4 py-3">
                  <span className={product.stock < 10 ? 'text-red-600 font-bold' : ''}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3">{product.categoria || '-'}</td>
                <td className="px-4 py-3">
                  <button className="text-blue-600 hover:underline mr-3">Editar</button>
                  <button className="text-red-600 hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay productos disponibles
          </div>
        )}
      </div>

      <div className="mt-4 text-gray-600">
        Total de productos: {filteredProducts.length}
      </div>
    </div>
  );
}

