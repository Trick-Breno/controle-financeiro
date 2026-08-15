import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { ResumoFinanceiro } from "../components/ResumoFinanceiro.jsx";
import { MenuNavegacao } from "../components/MenuNavegacao";

export function AppLayout() {
  return (
    <div className=" bg-violet-500 font-medium"> 
      <Header />
      <ResumoFinanceiro />
      
      <main className="max-w-7xl min-h-screen px-4 mt-6 pt-4 pb-20 rounded-t-3xl bg-gray-100">
        <Outlet />
      </main>
      <MenuNavegacao/>
    </div>
  );
}