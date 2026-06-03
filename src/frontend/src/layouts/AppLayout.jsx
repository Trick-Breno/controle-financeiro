import { Outlet } from "react-router-dom";
import Header from "../components/Header"; // Ajuste o caminho se a sua pasta for diferente

export default function AppLayout() {
  return (
    // A div principal ocupa pelo menos 100% da altura da tela e tem fundo cinza claro
    <div className="min-h-screen bg-gray-100">
      
      {/* O Header fica aqui, ele vai aparecer em TODAS as páginas desse layout */}
      <Header />
      
      {/* O 'main' centraliza o conteúdo da página e dá um espaçamento (padding) */}
      <main className="max-w-7xl mx-auto px- py- w-full">
        
        {/* A MÁGICA: O Outlet é onde as páginas (Dashboard, Despesas, etc) vão ser renderizadas */}
        <Outlet />
        
      </main>
      
    </div>
  );
}