import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import api from "../services/api";
import { useMovimentacoes } from "../contexts/MovimentacoesContext";
import { useCarteiras } from "../contexts/CarteirasContext";
import { BotaoFiltro } from "../components/BotaoFiltro";
import  Header from "../components/Header";


export default function Despesas() {
  const {carregarMovimentacoes, despesas, resumoDespesas, loading } = useMovimentacoes();
  const {carregarCarteiras, carteiras} = useCarteiras();
  const [filtroAtivo, setFiltroAtivo] = useState("pendente");
  const [itemAberto, setItemAberto] = useState(null);
  const [acaoAberta, setAcaoAberta] = useState(null);

  const { getToken, userId } = useAuth();


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

  const toggleItem = (id) => {
    if(itemAberto === id) {
      setItemAberto(null);
      setAcaoAberta(null);
    } else {
      setItemAberto(id);
      setAcaoAberta(null);
    }
  };

  const handlePagar = async (e, despesa) => {
    e.preventDefault();

    const dados = Object.fromEntries(new FormData(e.target)) ;

    const valorOriginal = Number(despesa.valor);
    const valorPago = Number(dados.valor_pago)

    try {
      const token = await getToken();
      const headers = { Authorization: `Bearer ${token}`};

      if(valorPago >= valorOriginal) {
        await api.patch(`/movimentacoes/${despesa.id}`, {
          id_carteira: dados.id_carteira,
          status: 'concluido'
        }, {headers});
      } else {
        const valorRestante = valorOriginal - valorPago;

        await api.post(`/movimentacoes`, {
          descricao: `${despesa.descricao} (Parcial)`,
          valor: valorPago,
          id_carteira: dados.id_carteira,
          tipo: despesa.tipo,
          status: 'concluido',
          data_referencia: despesa.data_referencia
        }, {headers});
        
        await api.patch(`/movimentacoes/${despesa.id}`, {
          valor: valorRestante,
        }, {headers})
      }

      setItemAberto(null);
      await carregarMovimentacoes();
      await carregarCarteiras();

    } catch (error) {
      console.error("Erro ao pagar:", error);
    }
  };

  const handleEditar = async (e, idDespesa) => {
    e.preventDefault();

    const dados = Object.fromEntries(new FormData(e.target));

    try {
      const token = await getToken();

      await api.patch(`/movimentacoes/${idDespesa}`, {
        descricao: dados.descricao,
        valor: Number(dados.valor),
        tipo: dados.tipo
      }, { headers: {Authorization: `Bearer ${token}`}
      })

      setItemAberto(null);
      await carregarMovimentacoes();

    } catch (error) {
      console.error("Erro ao editar", error)
    }
  };

  

  return (
    <div className="mt-  border-t border-gray-300  bg-gray-100 ">
      <div className=" mx-4 pb-6 pt-2 flex gap-2  ">
        <BotaoFiltro selecionado={filtroAtivo === "pendente"} onClick={() => setFiltroAtivo("pendente")}>
          Pendente 
        </BotaoFiltro>
        <BotaoFiltro selecionado={filtroAtivo === "concluido"} onClick={() => setFiltroAtivo("concluido")}>
          Pago
        </BotaoFiltro>
        <BotaoFiltro selecionado={filtroAtivo === "todas"} onClick={() => setFiltroAtivo("todas")}>
          Todas
        </BotaoFiltro>
      </div>

      <div className=" w-full flex flex-col gap-4 ">
        {despesasFiltradas.map((despesa) => (
          <div className={`${itemAberto === despesa.id ? `${"bg-violet-50 font-semibold text-violet-700 text-sm border border-violet-200 shadow-md rounded-xl  mx-4  "}` : `${"bg-white text-sm shadow-sm mx-4 border border-gray-200  rounded-xl   "}` } }`} key={despesa.id}>
            <div className=" py-6 px-6 flex items-center gap-4 justify-between" 
              onClick={() => toggleItem(despesa.id)} >

              <div className="w-full   ">
                <span>{despesa.descricao}</span>
              </div>
              <div className="w-full  ">
                <span>R$ {despesa.valor}</span>
              </div>
              <div className="">
                <span>{renderizarStatus(despesa.status) }</span>
              </div>
            </div>

            {itemAberto === despesa.id && (
              <div>
                {!acaoAberta && (
                  <div className="flex gap-4 justify-center">
                    <button                      
                      className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-100 transition"
                      onClick={() => setAcaoAberta('editar')}
                      > Editar Dados
                    </button>
                    <button
                      className="flex-1 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition"
                      onClick={() => setAcaoAberta('pagar')}
                      > Fazer Pagamento
                    </button>
                  </div>
                )}

                {acaoAberta === 'editar' && (
                  <form onSubmit={(e) => handleEditar(e, despesa.id)} className="animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex flex-col">
                            <label className="text-xs text-gray-600 mb-1">Renomear Descrição</label>
                            <input name="descricao" defaultValue={despesa.descricao} className="border border-gray-300 rounded px-2 py-1.5 text-sm" required />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs text-gray-600 mb-1">Corrigir Valor Total</label>
                            <input name="valor" type="number" step="0.01" defaultValue={despesa.valor} className="border border-gray-300 rounded px-2 py-1.5 text-sm" required />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs text-gray-600 mb-1">Alterar Tipo</label>
                            <select name="tipo" defaultValue={despesa.tipo} className="border border-gray-300 bg-white rounded px-2 py-1.5 text-sm">
                                <option value="despesa">Despesa</option>
                                <option value="receita">Receita</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <button type="button" onClick={() => setAcaoAberta(null)} className="text-sm text-gray-500 px-4 py-1.5 hover:underline">Cancelar</button>
                        <button type="submit" className="text-sm bg-gray-800 text-white px-4 py-1.5 rounded-md hover:bg-gray-900 transition">Salvar Alterações</button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {acaoAberta === 'pagar' && (
              <form onSubmit={(e) => handlePagar(e, despesa)} className="animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex flex-col">
                          <label className="text-xs text-gray-600 mb-1">Valor a Pagar</label>
                          {/* Note que o defaultValue puxa o valor total para facilitar, mas o usuário pode apagar e colocar menos */}
                          <input name="valor_pago" type="number" step="0.01" defaultValue={despesa.valor} max={despesa.valor} className="border border-gray-300 rounded px-2 py-1.5 text-sm" required />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-xs text-gray-600 mb-1">Carteira de Origem</label>
                          <select name="id_carteira" className="border border-gray-300 bg-white rounded px-2 py-1.5 text-sm" required>
                              <option value="">Selecione...</option>
                              {carteiras.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                          </select>
                      </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                      <button type="button" onClick={() => setAcaoAberta(null)} className="text-sm text-gray-500 px-4 py-1.5 hover:underline">Voltar</button>
                      <button type="submit" className="text-sm bg-violet-600 text-white px-4 py-1.5 rounded-md hover:bg-violet-700 transition">Confirmar Pagamento</button>
                  </div>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
/*                    <input className="border border-gray-300  rounded-sm text-sm" 
                      type="number"
                      defaultValue={despesa.valor}/>*/

                      /*                     <div className="bg-white px-2 grid grid-cols-3 gap-4 mb-4 pt-6 font-normal ">
                      <div className=" flex flex-col text-gray-600 ">
                        <label className=" text-xs text-gray-600 ">Renomear</label>
                        <input className="border border-gray-300  rounded-sm text-sm" 
                          name="descricao"
                          type="text"
                          defaultValue={despesa.descricao}/>
                      </div>
                      <div className="flex flex-col text-gray-600 ">
                        <label className="text-xs text-gray-600">Valor</label>
                        <input className="text-xs text-gray-600 border border-gray-300" 
                          name="valor"
                          type="number" step="0.01"
                          defaultValue={despesa.valor} />
                      </div>
                      <div className="flex flex-col text-gray-600">
                        <label className=" text-xs ">Tipo</label>
                        <select name="tipo" className="border border-gray-300 bg-white rounded-sm text-sm">
                          <option value="despesa">Despesa</option>
                          <option value="receita">Receita</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className=" rounded-b-xl bg-white px-2 grid grid-cols-3 gap-4 pb-4 font-normal ">
                      <div className=" flex flex-col text-gray-600 ">
                        <label className=" text-xs text-gray-600 ">Pagar</label>

                      </div>
                      <div className="flex flex-col text-gray-600">
                        <label className=" text-xs ">Carteira</label>
                        <select name="id_carteira" className="border border-gray-300 bg-white rounded-sm text-sm">
                          <option value="">selecione</option>
                          {carteiras.map((carteira) => (
                            <option key={carteira.id} value={carteira.id}>{carteira.nome}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col justify-end">
                        <button type="submit" className="text-sm text-gray-700 bg-violet-100 px-4 py-1 rounded-md">Confirmar</button>
                      </div>
                    </div>
*/