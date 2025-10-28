// Tipos principales para el sistema de almacén

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: 'ADMIN' | 'VENDEDOR';
  activo: boolean;
}

export interface Supplier {
  id: number;
  nombre: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  activo: boolean;
}

export interface Product {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  categoria?: string;
  activo: boolean;
  proveedorId: number;
  proveedor?: Supplier;
}

export interface Quote {
  id: number;
  codigo: string;
  clienteNombre: string;
  clienteEmail: string;
  fecha: Date;
  total: number;
  estado: 'PENDIENTE' | 'ENVIADA' | 'ACEPTADA' | 'RECHAZADA';
  usuarioId: number;
  items?: QuoteItem[];
}

export interface QuoteItem {
  id: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  productId: number;
  product?: Product;
}

export interface Sale {
  id: number;
  fecha: Date;
  total: number;
  metodoPago: 'EFECTIVO' | 'TRANSFERENCIA' | 'TARJETA' | 'CREDITO';
  clienteNombre: string;
  clienteEmail?: string;
  clienteTelefono?: string;
  cotizacionId?: number;
  usuarioId: number;
  items?: SaleItem[];
}

export interface SaleItem {
  id: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  productId: number;
  product?: Product;
}

export interface AuthResponse {
  message: string;
  data: {
    user: User;
    access_token: string;
    refresh_token: string;
  };
}

