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
      setAcaoAberta("pagar");
    }
  };

  const handlePagar = async (e, despesa) => {
    e.preventDefault();

    const dados = Object.fromEntries(new FormData(e.target));

    const valorOriginal = Number(despesa.valor);
    const valorPago = Number(dados.valor_pago);

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
        const dataLimpa = despesa.data_referencia ? despesa.data_referencia.split('T')[0] : new Date().toISOString().split('T')[0];

        await api.post(`/movimentacoes`, {
          descricao: `${despesa.descricao} (Parcial)`,
          valor: valorPago,
          id_carteira: dados.id_carteira,
          tipo: despesa.tipo,
          status: 'concluido',
          data_referencia: dataLimpa
        }, {headers});
        
        await api.patch(`/movimentacoes/${despesa.id}`, {
          valor: valorRestante
        }, {headers})
      }

      setItemAberto(null);
      setAcaoAberta(null);
      await carregarMovimentacoes();
      await carregarCarteiras();

    } catch (error) {
      console.error("Erro ao pagar:", error);
      alert(JSON.stringify(error.response?.data || error.message));
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
      console.error("Erro ao editar despesa", error)
    }
  };

  const handleDeletar = async(despesa) => {

    try {
      const token = await getToken();

      await api.delete(`/movimentacoes/${despesa.id}`,{
        headers: { Authorization: `Bearer ${token}`}
      });

      setItemAberto(null);
      await carregarMovimentacoes();
      await carregarCarteiras();

    } catch (error) {
      console.error("Erro ao deletar despesa", error);
      alert(JSON.stringify(error.response?.data || error.message));
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
          <div className="shadow-sm mx-4 border border-gray-200  rounded-xl   "key={despesa.id}>
            <div className={`${itemAberto === despesa.id ? `${"border border-violet-300 border-b-white bg-violet-50 font-semibold text-violet-700 text-sm  rounded-t-xl py-6 px-6 flex items-center gap-4 justify-between"}` : `${"bg-white text-sm border border-gray-200 rounded-xl py-6 px-6 flex items-center gap-4 justify-between"}` } }`}
 
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
              <div className="rounded-b-xl border border-violet-300 border-t-violet-200 bg-white">                

              <div className="flex p-4 justify-center w-full">
                <div className="flex   rounded-xl border border-violet-300 bg-white ">
                  <button
                    className={`${acaoAberta === 'pagar' ? `${"py-1 px-6 flex-1 text-sm bg-violet-50 text-violet-700 border-r border-violet-300 rounded-xl "}`: `${"py-1 px-6 text-gray-600 text-sm  rounded-xl "}`}}`}
                    onClick={() => setAcaoAberta('pagar')}
                    > Pagar
                  </button>
                  <button                      
                    className={`${acaoAberta === 'editar' ?`${"py-1 px-6 flex-1 text-sm bg-violet-50 text-violet-700 border-l border-violet-300 rounded-xl "}`: `${"py-1 px-6 text-gray-600 text-sm rounded-xl "}`}}`}
                    onClick={() => setAcaoAberta('editar')}
                    > Editar
                  </button>
                </div>
              </div>

                {acaoAberta === 'editar' && (
                  <form onSubmit={(e) => handleEditar(e, despesa.id)} className="animate-fade-in">
                    <div className="pr-8 pl-4 grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex flex-col">
                            <label className="text-xs text-gray-600 mb-1">Descrição</label>
                            <input name="descricao" defaultValue={despesa.descricao} className="border border-gray-300 rounded px-2 py-1.5 text-sm" required />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs text-gray-600 mb-1">Valor</label>
                            <input name="valor" type="number" step="0.01" defaultValue={despesa.valor} className="border border-gray-300 rounded px-2 py-1.5 text-sm" required />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs text-gray-600 mb-1">Tipo</label>
                            <select name="tipo" defaultValue={despesa.tipo} className="border border-gray-300 bg-white rounded px-2 py-1.5 text-sm">
                                <option value="despesa">Despesa</option>
                                <option value="receita">Receita</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col p-2 gap-2 ">
                      <div>
                        <button type="submit" className="w-full  py-2 rounded-md text-sm bg-violet-700 text-white ">Salvar Alterações</button>
                      </div>
                      <div>
                        <button type="button" onClick={() => handleDeletar(despesa)} className="w-full  text-sm text-red-500 py-2 border  border-red-300 rounded-md ">Excluir </button>
                      </div>
                    </div>
                  </form>
                )}

                {acaoAberta === 'pagar' && (
                  <form onSubmit={(e) => handlePagar(e, despesa)} className="animate-fade-in">
                      <div className="pl-4 pr-8 grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex flex-col">
                              <label className="text-xs text-gray-600 mb-1">Valor a Pagar</label>
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


/* bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition*/

/*if(valorPago >= valorOriginal) {
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
          valor: valorRestante
        }, {headers})
      }*/