import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import ResumoFinanceiro from "../components/ResumoFinanceiro";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-violet-500 "> 
      <Header />
      <ResumoFinanceiro />
      
      <main className="max-w-7xl mx-auto py-4 w-full">
        <Outlet />
      </main>
      
    </div>
  );
}