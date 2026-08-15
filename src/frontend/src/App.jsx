import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { PrivateRoute } from './routes/PrivateRoute';
import { Receitas } from './pages/Receitas';
import { Carteiras } from './pages/Carteiras';
import { Movimentacoes } from './pages/Movimentacoes'; // Importando a nova página principal
import { Despesas } from './pages/Despesas';

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<PrivateRoute />}>
        <Route element={<AppLayout />}>
          
          <Route path="/" element={<Despesas />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/carteiras" element={<Carteiras />} />
          <Route path="/receitas" element={<Receitas />} />

        </Route>
      </Route>
    </Routes>
  );
}