import { useEffect, useState } from 'react';
import { productsService } from '../services/api';
import type { Product } from '../types';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productsService.getAll();
      console.log('Products response:', response);
      setProducts(response.data?.data || response.data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Productos</h2>
        <button className="btn-primary">
          + Nuevo Producto
        </button>
      </div>

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

