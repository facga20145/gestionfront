# 🚗 Frontend - Sistema de Gestión de Almacén

## ✅ **Archivos Creados**

### **Configuración:**
- ✅ `tailwind.config.js` - Configuración de Tailwind CSS
- ✅ `postcss.config.js` - Configuración de PostCSS
- ✅ `src/index.css` - Estilos globales con Tailwind
- ✅ `src/types/index.ts` - Tipos TypeScript

### **Servicios:**
- ✅ `src/services/api.ts` - Servicio API para conectar con backend

### **Layout:**
- ✅ `src/components/Layout/index.tsx` - Layout principal
- ✅ `src/components/Layout/Header.tsx` - Header con navegación
- ✅ `src/components/Layout/Sidebar.tsx` - Sidebar con menú
- ✅ `src/components/Layout/Footer.tsx` - Footer

### **Páginas:**
- ✅ `src/pages/Login.tsx` - Página de inicio de sesión
- ✅ `src/pages/Dashboard.tsx` - Dashboard principal
- ✅ `src/pages/Products.tsx` - Lista de productos
- ✅ `src/pages/Suppliers.tsx` - Lista de proveedores
- ✅ `src/pages/Quotes.tsx` - Lista de cotizaciones
- ✅ `src/pages/Sales.tsx` - Lista de ventas

### **Configuración:**
- ✅ `src/App.tsx` - Configuración de rutas
- ✅ `src/main.tsx` - Entry point

## 🚀 **Cómo Usar**

### **1. Crear archivo .env:**

Crea un archivo `.env` en la raíz de `gestionfront`:

```env
VITE_API_URL=http://localhost:4001/api
```

### **2. Iniciar el servidor de desarrollo:**

```bash
cd gestionfront
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

### **3. Asegúrate de que el backend esté corriendo:**

```bash
cd gestion-de-almacen
pnpm run start:dev
```

Backend: `http://localhost:4001`

## 📋 **Rutas Disponibles**

- `/login` - Inicio de sesión
- `/` - Dashboard
- `/products` - Productos
- `/suppliers` - Proveedores
- `/quotes` - Cotizaciones
- `/sales` - Ventas

## 🎨 **Características**

- ✅ Diseño responsive con Tailwind CSS
- ✅ Conexión automática con backend
- ✅ Autenticación JWT
- ✅ Tablas con búsqueda
- ✅ Navegación con menú lateral
- ✅ Estadísticas en Dashboard
- ✅ Indicadores de estado (Stock bajo, etc.)

## 🔗 **Conexión con Backend**

El frontend se conecta automáticamente a tu backend en:
- URL Base: `http://localhost:4001/api`
- Autenticación: JWT Bearer Token
- Headers: Automático

## 📝 **Próximos Pasos**

Para agregar funcionalidad:
1. Crear formularios de creación/edición
2. Agregar modales de confirmación
3. Implementar paginación
4. Agregar gráficas en Dashboard
5. Mejorar UX con loading states

¡Listo para probar! 🎉
