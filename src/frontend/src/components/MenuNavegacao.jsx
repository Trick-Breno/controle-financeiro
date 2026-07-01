import { NavLink } from "react-router-dom";

export default function MenuNavegacao() {
    const estiloInativo = "flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-gray-600 transition-colors";
    const estiloAtivo = "flex flex-col items-center justify-center w-full h-full text-violet-700 font-semibold";

    return (
        <nav className="fixed bottom-0 left-0 w-full h-16 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex justify-between z-50 pb-safe">
            
            <NavLink 
                to="/" 
                className={({ isActive }) => isActive ? estiloAtivo : estiloInativo}
            >
                <span className="text-xl mb-1">💸</span>
                <span className="text-[10px] uppercase tracking-wider">Movimentações</span>
            </NavLink>

            <NavLink 
                to="/carteiras" 
                className={({ isActive }) => isActive ? estiloAtivo : estiloInativo}
            >
                <span className="text-xl mb-1">💰​</span>
                <span className="text-[10px] uppercase tracking-wider">Carteiras</span>
            </NavLink>

            <NavLink 
                to="/dashboard" 
                className={({ isActive }) => isActive ? estiloAtivo : estiloInativo}
            >
                <span className="text-xl mb-1">📊</span>
                <span className="text-[10px] uppercase tracking-wider">Resumo</span>
            </NavLink>

        </nav>
    );
}