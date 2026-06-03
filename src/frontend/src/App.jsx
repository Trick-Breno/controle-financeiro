import { Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import PrivateRoute from './routes/PrivateRoute';
import Carteiras from './pages/Receitas';
import Movimentacoes from './pages/Movimentacoes'; // Importando a nova página principal

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<PrivateRoute />}>
        <Route element={<AppLayout />}>
          
          <Route path="/" element={<Movimentacoes />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/carteiras" element={<Carteiras />} />

        </Route>
      </Route>
    </Routes>
  );
}