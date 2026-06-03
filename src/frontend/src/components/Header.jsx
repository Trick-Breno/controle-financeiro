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
        <div className="mb-2 pt-4">
            <span className=" m-6"><UserButton/></span>

            <div className="mx-6 mt-2 px-4 shadow-md rounded-xl border border-gray-200   bg-white divide-y divide-gray-300">
                <div className="flex w-full gap-4 py-3 px-4  justify-between">
                    <h2 className="text-lg font-medium text-gray-800">Saldo</h2>
                    <span className="text-lg font-medium text-green-500">R$ 575.00</span>
                </div>    
                <ul className=" space-y-2 py-3 px-4">
                    <li className="flex gap-6 justify-between ">
                        <span className="text-sm text-gray-700 ">Despesas</span>
                        <span className="text-sm text-gray-700 gap-6">R$ {Number(resumoDespesas.total).toFixed(2)}</span>
                    </li>
                    <li className="flex gap-6 justify-between ">
                        <span className="text-sm text-gray-600 ">Pago</span>
                        <span className="text-sm text-gray-600 gap-6">R$ {Number(resumoDespesas.pago).toFixed(2)}</span>
                    </li>
                    <li className="flex gap-6 justify-between">
                        <span className="text-sm text-gray-700">Pendente</span>
                        <span className="text text-red-500 gap-6">R$ {Number(resumoDespesas.falta).toFixed(2)}</span>
                    </li>
                </ul>
            </div>
            <div className="mx-2 mt-6 flex border  rounded-2xl  bg-white">
                    <button className="py-1  flex-1 text-sm text-violet-700 border border-violet-300 rounded-2xl  bg-violet-100">Despesas</button>
                    <button className="py-1  flex-1 text-sm text-gray-700 "> Carteiras</button>
            </div>
        </div>
    )
} 
export default Header
