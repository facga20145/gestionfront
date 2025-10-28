import { useEffect, useState } from 'react';
import { productsService, salesService, quotesService } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    productos: 0,
    ventas: 0,
    cotizaciones: 0,
    stockBajo: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [products, sales, quotes] = await Promise.all([
        productsService.getAll(),
        salesService.getAll(),
        quotesService.getAll(),
      ]);

      const productsList = products.data?.data || products.data || [];
      const salesList = sales.data?.data || sales.data || [];
      const quotesList = quotes.data?.data || quotes.data || [];
      
      const stockBajo = productsList.filter((p: any) => p.stock < 10)?.length || 0;

      setStats({
        productos: productsList?.length || 0,
        ventas: salesList?.length || 0,
        cotizaciones: quotesList?.length || 0,
        stockBajo,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const statCards = [
    { title: 'Total Productos', value: stats.productos, icon: '📦', color: 'blue' },
    { title: 'Ventas Totales', value: stats.ventas, icon: '💰', color: 'green' },
    { title: 'Cotizaciones', value: stats.cotizaciones, icon: '📝', color: 'purple' },
    { title: 'Stock Bajo', value: stats.stockBajo, icon: '⚠️', color: 'red' },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <span className="text-4xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Bienvenido a Automotive OS</h3>
        <p className="text-gray-600">
          Sistema de gestión para almacén de repuestos automotrices.
          Gestiona productos, proveedores, cotizaciones y ventas desde un solo lugar.
        </p>
      </div>
    </div>
  );
}

