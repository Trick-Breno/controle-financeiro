import { useAuth } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const { isLoaded, userId } = useAuth();

  // Enquanto o Clerk está verificando a sessão, mostra um loading genérico
  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-semibold">Carregando...</p>
      </div>
    );
  }

  // Se não tiver usuário logado, expulsa para a tela de login
  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver tudo ok, o <Outlet /> renderiza a tela que o usuário pediu (ex: Dashboard)
  return <Outlet />;
}