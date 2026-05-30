import { Routes, Route } from 'react-router-dom';
import Header from "./components/Header";
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import PrivateRoute from './routes/PrivateRoute';
import Despesas from './pages/Despesas';

export default function App() {
  return (
    <>
    <Header/>
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/login" element={<Login />} />

      {/* Rotas Privadas (Protegidas pelo PrivateRoute) */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Despesas />} />
                <Route path="/dashboard" element={<Dashboard />} />

        {/* Futuramente: <Route path="/despesas" element={<Despesas />} /> */}
      </Route>
    </Routes>
    </>
  );
}