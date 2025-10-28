import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Suppliers from './pages/Suppliers';
import Quotes from './pages/Quotes';
import Sales from './pages/Sales';
import Login from './pages/Login';
import AuthGuard from './guards/AuthGuard';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/" 
          element={
            <AuthGuard>
              <Layout />
            </AuthGuard>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="quotes" element={<Quotes />} />
          <Route path="sales" element={<Sales />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
