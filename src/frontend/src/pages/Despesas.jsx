import { useState } from "react";
import { useMovimentacoes } from "../contexts/MovimentacoesContext";
import { BotaoFiltro } from "../components/BotaoFiltro";
import  Header from "../components/Header";


export default function Despesas() {
  const { despesas, resumoDespesas, loading } = useMovimentacoes();
  const [filtroAtivo, setFiltroAtivo] = useState("pendente");

  if (loading) return <p>Carregando...</p>;

  const renderizarStatus = (status) => {
    const statusAtual = status;
    
    let cor = '';

    if (statusAtual === 'pendente') {
      cor = 'bg-red-500';
    } else if (statusAtual === 'parcial') {
      cor = 'bg-yellow-500';
    } else if (statusAtual === 'concluido') {
      cor = 'bg-green-500';
    }

    return (
      <div className="flex items-center justify-center" title={status}>
        <span className={`w-3 h-3 rounded-full shadow-sm ${cor}`}></span>
      </div>
    );
  };

  const despesasFiltradas = despesas.filter((d) => {
    if (filtroAtivo === "todas") {
      return true; }
    else {
      return d.status === filtroAtivo;
    }
    
  })

  return (

    <div className=" gap-4">

        <div className="mx-2 shadow-md border border-gray-100  bg-white rounded-xl">
            <div className="mt-2 mx-1 pb-2 flex gap-2  ">
                <BotaoFiltro selecionado={filtroAtivo === "pendente"} onClick={() => setFiltroAtivo("pendente")}>
                  Pendente 
                </BotaoFiltro>
                <BotaoFiltro selecionado={filtroAtivo === "concluido"} onClick={() => setFiltroAtivo("concluido")}>
                  Pago 1
                </BotaoFiltro>
                <BotaoFiltro selecionado={filtroAtivo === "todas"} onClick={() => setFiltroAtivo("todas")}>
                  Todas
                </BotaoFiltro>
            </div>

            <table className="mt-4 w-full  ">
                <tbody className=" divide-y divide-gray-300">
                {despesasFiltradas.map((despesa) => (
                    <tr className="" key={despesa.id}>
                        <td className="py-4 ps-6  text-gray-700  ">{despesa.descricao.charAt(0).toUpperCase() + despesa.descricao.slice(1)}</td>
                        <td className="py-4 text-sm  text-gray-600">R$ {Number(despesa.valor).toFixed(2)}</td>
                        <td className="py-4 ">{renderizarStatus(despesa.status)}</td>
                        <td className="pe-6 py-2  text-right">
                            <button className="text-blue-500 hover:text-blue-700 transition-colors">
                            E
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
  );
}