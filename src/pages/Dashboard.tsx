import { useEffect, useState } from 'react';
import { productsService, salesService, quotesService } from '../services/api';
import { Boxes, DollarSign, ClipboardList, Truck, TrendingUp, PieChart } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPiezas: 8450,
    valorInventario: 1250000,
    pedidosProcesar: 72,
    enviosHoy: 15,
  });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);

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

      const productsList = Array.isArray(products.data?.data) 
        ? products.data.data 
        : Array.isArray(products.data) 
        ? products.data 
        : Array.isArray(products)
        ? products
        : [];
      
      const salesList = Array.isArray(sales.data?.data)
        ? sales.data.data
        : Array.isArray(sales.data)
        ? sales.data
        : [];
      
      
      // Calcular valor total del inventario
      const valorTotal = Array.isArray(productsList)
        ? productsList.reduce((sum: number, p: any) => {
            return sum + (Number(p.precio || 0) * Number(p.stock || 0));
          }, 0)
        : 0;

      setStats({
        totalPiezas: productsList.length,
        valorInventario: valorTotal,
        pedidosProcesar: quotes.length,
        enviosHoy: salesList.length,
      });

      // Usar datos reales de ventas si existen, sino mostrar datos mock
      if (salesList.length > 0) {
        // Mapear ventas reales
        const realActivity = salesList.slice(0, 4).map((sale: any) => ({
          id: sale.id || sale.codigo || `V-${sale.id}`,
          producto: sale.productos?.map((p: any) => p.nombre || p.producto?.nombre).join(', ') || 'Venta',
          cantidad: sale.totalItems || sale.productos?.length || 0,
          fecha: new Date(sale.fecha || sale.createdAt).toLocaleString('es-ES'),
          estado: sale.estado || 'Entregado',
        }));
        setRecentActivity(realActivity);
      } else {
        // Mostrar datos mock si no hay ventas
        setRecentActivity([
          { id: 'Sin datos', producto: 'No hay ventas registradas', cantidad: 0, fecha: new Date().toLocaleDateString(), estado: 'Sin datos' },
        ]);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const getStatusColor = (estado: string) => {
    const colors: any = {
      'Enviado': 'bg-green-100 text-green-800',
      'En Proceso': 'bg-orange-100 text-orange-800',
      'Entregado': 'bg-green-100 text-green-800',
      'Pendiente': 'bg-red-100 text-red-800',
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header con filtros */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard General</h2>
        <div className="flex gap-3">
          <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700">
            <option>Rango de Fechas: Últimos 30 días</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700">
            <option>Almacén Principal</option>
          </select>
        </div>
      </div>

      {/* KPIs - Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total de Piezas en Stock</p>
              <p className="text-4xl font-bold text-gray-800">{stats.totalPiezas.toLocaleString()}</p>
            </div>
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
              <Boxes className="w-8 h-8 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Valor del Inventario</p>
              <p className="text-4xl font-bold text-gray-800">${stats.valorInventario.toLocaleString()}</p>
            </div>
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-green-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Pedidos por Procesar</p>
              <p className="text-4xl font-bold text-gray-800">{stats.pedidosProcesar}</p>
            </div>
            <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ClipboardList className="w-8 h-8 text-yellow-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Envíos de Hoy</p>
              <p className="text-4xl font-bold text-gray-800">{stats.enviosHoy}</p>
            </div>
            <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
              <Truck className="w-8 h-8 text-purple-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendencia de Inventario */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Tendencia de Inventario</h3>
            <span className="inline-flex items-center gap-1 text-green-600 font-semibold text-sm">
              <TrendingUp className="w-4 h-4" />  Últimos 30 días
            </span>
          </div>
          <div className="h-48 bg-gradient-to-t from-blue-50 to-white rounded-lg px-4 py-3 flex items-end gap-2">
            {[0.4, 0.6, 0.5, 0.7, 0.9, 1].map((value, idx) => (
              <div
                key={idx}
                className="flex-1 bg-blue-500 rounded-t-md"
                style={{ height: `${value * 100}%`, opacity: 0.5 + value * 0.4 }}
              />
            ))}
          </div>
        </div>

        {/* Stock por Categoría */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Stock por Categoría</h3>
            <PieChart className="w-5 h-5 text-gray-500" />
          </div>
          <div className="flex items-center justify-center h-48">
            <div className="relative w-40 h-40">
              <div className="absolute inset-0 rounded-full border-8 border-blue-500 border-r-green-500 border-b-yellow-500 border-l-gray-300" />
              <div className="absolute inset-4 rounded-full bg-white flex flex-col items-center justify-center">
                <p className="text-xl font-bold text-gray-800">
                  {stats.totalPiezas.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Piezas</p>
              </div>
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span className="text-sm text-gray-700">Motores</span>
              </div>
              <span className="text-sm text-gray-600">40%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span className="text-sm text-gray-700">Frenos</span>
              </div>
              <span className="text-sm text-gray-600">30%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                <span className="text-sm text-gray-700">Suspensión</span>
              </div>
              <span className="text-sm text-gray-600">20%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-700">Otros</span>
              </div>
              <span className="text-sm text-gray-600">10%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Envíos Recientes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Envíos Recientes</h3>
            <p className="text-sm text-gray-600">Últimos movimientos registrados hoy.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Envío</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentActivity.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{activity.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{activity.producto}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{activity.cantidad}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{activity.fecha}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(activity.estado)}`}>
                      <span className="w-2 h-2 rounded-full bg-current" /> {activity.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">Ver Detalles</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
