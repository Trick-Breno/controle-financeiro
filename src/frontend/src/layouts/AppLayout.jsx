import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import ResumoFinanceiro from "../components/ResumoFinanceiro";
import MenuNavegacao from "../components/MenuNavegacao";

export default function AppLayout() {
  return (
    <div className=" bg-violet-500 "> 
      <Header />
      <ResumoFinanceiro />
      
      <main className="max-w-7xl min-h-screen mt-6 pt-6 rounded-t-3xl bg-white">
        <Outlet />
      </main>
      <MenuNavegacao/>
    </div>
  );
}