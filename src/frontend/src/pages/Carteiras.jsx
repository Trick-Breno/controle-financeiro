import { useAuth } from "@clerk/clerk-react";
import api from "../services/api";
import { useMovimentacoes } from "../contexts/MovimentacoesContext";
import { useCarteiras } from "../contexts/CarteirasContext";

export default function Carteiras() {
    const {carregarCarteiras, carteiras} = useCarteiras();
    const {carregarMovimentacoes} = useMovimentacoes();
    const {getToken, userId} = useAuth();

    const handleCriar = async(e) => {
        e.preventDefault();

        const dados = Object.fromEntries(new FormData(e.target));

        try {
            const token = await getToken();

            await api.post(`carteiras/`,{
                nome: dados.nome,
                saldo_inicial: Number(dados.saldo_inicial)
            },{headers: {Authorization: `Bearer ${token}`}})

            e.target.reset();

            await carregarCarteiras();
        } catch (error) {
            console.error("Erro ao criar carteira", error);
            alert(JSON.stringify(error.response?.data || error.message));
        }
    };

    return (
        <div className="px-6">
            <form onSubmit={(e) => handleCriar(e)}>
                <div className="flex flex-col gap-2">
                    <h3 className=" font-medium text-lg text-gray-800 my-2">Criar Carteira</h3>
                    <div className="flex items-baseline gap-1">
                        <label className="">Nome</label>
                        <input type="text" name="nome" required className="p-1 border  border-gray-400  rounded-md"/>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <label className="">Saldo </label>
                        <input type="number" step="0.01" name="saldo_inicial" className="p-1 border  border-gray-400  rounded-md"/>
                    </div>
                    <button type="submit" className="my-4 py-2 px-6 font-bold bg-violet-700 rounded-md text-white">Salvar</button>
                </div>
            </form>
            {carteiras.map((carteira) => (
                <div key={carteira.id} className="flex justify-between py-1 font-medium text-gray-800">
                    <span>{carteira.nome}</span>
                    <span>R$ {carteira.saldo_atual}</span>
                </div>
            ))}  
        </div>
    )
}