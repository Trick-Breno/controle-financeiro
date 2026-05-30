import { useAuth, UserButton } from "@clerk/clerk-react";
import { useMovimentacoes } from "../contexts/MovimentacoesContext";
import { listarCarteiras } from "../services/carteira";
import { useState, useEffect } from "react";



const Header = () => {
    const [carteiras, setCarteiras] = useState([]);
    const { despesas, loading, resumoDespesas } = useMovimentacoes();
    const [erro, setErro] = useState("");
      

    

      const { getToken } = useAuth();
    
      useEffect(() => {
        const buscarDados = async () => {
                  
          try {
              const token = await getToken();
              const responseCarteiras = await listarCarteiras(token);
              setCarteiras(responseCarteiras);
            } catch (error) {
              setErro(error.message);
          }
        };
    
        buscarDados();
      }, [getToken]);

    return (
        <div className="m-4">
            <UserButton />
            <div className="flex w-full gap-2">
                <div className="rounded-xl border border-violet-900  bg-violet-50 p-3">
                    <h1 className="font-medium mb-4">Despesas</h1>
                    <ul className="space-y-4 divide-y divide-gray-300">
                        <li className="gap-3 flex justify-between">
                            <span>Pendente</span>
                            <span> R$ {resumoDespesas.falta}</span>
                        </li>
                        <li className=" flex justify-between">
                            <span >pago</span>
                            <span> R${resumoDespesas.pago}</span>
                        </li>
                        <li className=" flex justify-between">
                            <span >Total</span>
                            <span> R${resumoDespesas.total}</span>
                        </li>
                    </ul>
                </div>
                <div className="flex-1 rounded-xl border-purple-500 bg-gray-100 p-3">
                    <h1 className="font-medium mb-4">Carteiras</h1>
                    {!erro && carteiras.length > 0 && (
                        <ul className="space-y-4 divide-y divide-gray-300">
                            {carteiras.map((carteira) => (
                                <li key={carteira.id} className="gap-3 flex justify-between">
                                    <span>{carteira.nome} </span>
                                    <span> R$ {Number(carteira.saldo_atual).toFixed(2)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
} 
export default Header
