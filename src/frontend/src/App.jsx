import { Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import PrivateRoute from './routes/PrivateRoute';
import Despesas from './pages/Despesas';

export default function App() {
  return (
    <>
    <Routes>
      
      {/* Rotas Públicas */}
      <Route path="/login" element={<Login />} />

      {/* Rotas Privadas (Protegidas pelo PrivateRoute) */}
      <Route element={<PrivateRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Despesas />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Route>
    </Routes>
    </>
  );
}