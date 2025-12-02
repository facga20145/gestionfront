import { useState, useEffect } from 'react';
import { productsService, salesService } from '../services/api';
import type { Product } from '../types';
import { extractData } from '../utils/api-helper';

interface CreateSaleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateSaleModal({ isOpen, onClose, onSuccess }: CreateSaleModalProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [formData, setFormData] = useState({
        clienteNombre: '',
        clienteEmail: '',
        clienteTelefono: '',
        metodoPago: 'EFECTIVO',
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
            const response = await productsService.getAll();
            const list = extractData<Product>(response);
            setProducts(list);
        } catch (error) {
            console.error('Error loading products:', error);
            setProducts([]);
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
            await salesService.create({
                clienteNombre: formData.clienteNombre,
                clienteEmail: formData.clienteEmail || undefined,
                clienteTelefono: formData.clienteTelefono || undefined,
                metodoPago: formData.metodoPago,
                items: formData.items.map(({ productId, cantidad, precioUnitario }) => ({
                    productId,
                    cantidad,
                    precioUnitario
                }))
            });
            onSuccess();
            onClose();
            setFormData({
                clienteNombre: '',
                clienteEmail: '',
                clienteTelefono: '',
                metodoPago: 'EFECTIVO',
                items: []
            });
        } catch (error) {
            console.error('Error creating sale:', error);
            alert('Error al crear la venta');
        }
    };

    if (!isOpen) return null;

    const total = formData.items.reduce((acc, item) => acc + (item.cantidad * item.precioUnitario), 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Nueva Venta</h2>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Cliente</label>
                            <input
                                type="text"
                                required
                                className="input-field mt-1"
                                value={formData.clienteNombre}
                                onChange={e => setFormData({ ...formData, clienteNombre: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email (Opcional)</label>
                            <input
                                type="email"
                                className="input-field mt-1"
                                value={formData.clienteEmail}
                                onChange={e => setFormData({ ...formData, clienteEmail: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Teléfono (Opcional)</label>
                            <input
                                type="text"
                                className="input-field mt-1"
                                value={formData.clienteTelefono}
                                onChange={e => setFormData({ ...formData, clienteTelefono: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Método de Pago</label>
                            <select
                                className="input-field mt-1"
                                value={formData.metodoPago}
                                onChange={e => setFormData({ ...formData, metodoPago: e.target.value })}
                            >
                                <option value="EFECTIVO">Efectivo</option>
                                <option value="TRANSFERENCIA">Transferencia</option>
                                <option value="TARJETA">Tarjeta</option>
                                <option value="CREDITO">Crédito</option>
                            </select>
                        </div>
                    </div>

                    <div className="border-t border-b py-4 mb-4">
                        <h3 className="font-medium mb-2">Agregar Producto</h3>
                        <div className="flex gap-2">
                            <select
                                className="input-field flex-1"
                                value={selectedProduct}
                                onChange={e => setSelectedProduct(e.target.value)}
                            >
                                <option value="">Seleccionar producto...</option>
                                {products.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.nombre} - ${p.precio}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                min="1"
                                className="input-field w-24"
                                value={quantity}
                                onChange={e => setQuantity(parseInt(e.target.value))}
                            />
                            <button
                                type="button"
                                onClick={handleAddItem}
                                className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
                            >
                                Agregar
                            </button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="text-left p-2">Producto</th>
                                    <th className="text-right p-2">Cant.</th>
                                    <th className="text-right p-2">Precio</th>
                                    <th className="text-right p-2">Total</th>
                                    <th className="p-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.items.map((item, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="p-2">{item.nombre}</td>
                                        <td className="text-right p-2">{item.cantidad}</td>
                                        <td className="text-right p-2">${item.precioUnitario}</td>
                                        <td className="text-right p-2">${item.cantidad * item.precioUnitario}</td>
                                        <td className="text-right p-2">
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveItem(index)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                ×
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={3} className="text-right p-2 font-bold">Total:</td>
                                    <td className="text-right p-2 font-bold">${total}</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={formData.items.length === 0}
                        >
                            Crear Venta
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
