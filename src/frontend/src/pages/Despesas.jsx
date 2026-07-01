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
        <span className={`w-2 h-2 rounded-full shadow-sm ${cor}`}></span>
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

  const handleCriar = async (e) => {
    e.preventDefault();

    const dados = Object.fromEntries(new FormData(e.target));
    const dataDeHoje = new Date().toISOString().split('T')[0];

    try {
      const token = await getToken();

      await api.post(`/movimentacoes`, {
        descricao: dados.descricao,
        valor: Number(dados.valor),
        tipo: 'despesa',
        status: 'pendente',
        data_referencia: dataDeHoje

      }, {headers: {Authorization: `Bearer ${token}`}});

      e.target.reset();

      await carregarMovimentacoes();
    } catch (error) {
      console.error("erro ao pagar", error);
      alert(JSON.stringify(error.response?.data || error.messsage ));
    }
  };

  const handlePagar = async (e, despesa) => {
    e.preventDefault();

    const dados = Object.fromEntries(new FormData(e.target));

    const valorOriginal = Number(despesa.valor);
    const valorPago = Number(dados.valor_pago);

    const carteiraSelecionada = carteiras.find(c => c.id === dados.id_carteira);

    if (valorPago > Number(carteiraSelecionada.saldo_atual)) {
      alert(`Saldo insuficiente!`);
      return;
    }
    
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
    <div className="mt-6  bg-white ">
      <div className=" mx-4 pb-6 pt-2 flex gap-1   ">
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
        <form onSubmit={(e) => handleCriar(e)}>
          <div className="flex flex-col mx-2 mb-6 py-2">
            <div className="grid grid-cols-12 mx-1 my-2">
              <input type="text" name="descricao" className="col-span-7 p-1 border border-gray-400  rounded-l-lg " placeholder="Nome" required/>
              <input type="number" step="0.01" name="valor" className="col-span-4 pl-2 border border-gray-400 border-l-0 rounded-r-lg " placeholder="R$" required />   
            <div className="col-span-1">
              <button type="submit" className="text-2xl font-bold  bg-violet-700 text-white w-full mx-1 rounded-md ">+</button>
            </div>
            </div>
          </div>
        </form>

      <div className="w-full flex flex-col">
        {despesasFiltradas.map((despesa) => (
          <div className={`${itemAberto === despesa.id ? `${" mx-4 text-lg bg-gray-50 border-2 border-violet-500 rounded-xl"}` : `${" mx-4 text-lg "}` } }`}key={despesa.id}>

            <div className={`${itemAberto === despesa.id ? `${" py-4 px-2 flex items-center justify-between"}` : `${"bg-white  border- border-gray-200 py-4 px-2 flex items-center gap-2 justify-between"}` } }`}
 
              onClick={() => toggleItem(despesa.id)} >

              <div className="font-semibold  text-gray-800">
                <span>{despesa.descricao}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span>R$ {despesa.valor}</span>
                <span>{renderizarStatus(despesa.status) }</span>

              </div>
            </div>

            {itemAberto === despesa.id && (
              <div className=" rounded-b-2xl border-t border-gray-200 bg-white">                

              <div className="flex pb-6 pt-2 justify-center w-full">
                <div className="flex  bg-white ">
                  <button
                    className={`${acaoAberta === 'pagar' ? `${" py-1 px-6 flex-1 text-base font-medium  text-violet-700 border-b-2  border-violet-500 "}`: `${" py-1 px-6 text-gray-700 text-base border-b  border-gray-200  "}`}}`}
                    onClick={() => setAcaoAberta('pagar')}
                    > Pagar
                  </button>
                  <button                      
                    className={`${acaoAberta === 'editar' ?`${" py-1 px-6 flex-1 text-base font-medium  text-violet-700 border-b-2  border-violet-500 "}`: `${" py-1 px-6 text-gray-700 text-base border-b  border-gray-200 "}`}}`}
                    onClick={() => setAcaoAberta('editar')}
                    > Editar
                  </button>
                </div>
              </div>

                {acaoAberta === 'editar' && (
                  <form onSubmit={(e) => handleEditar(e, despesa.id)} className="animate-fade-in">
                    <div className="flex flex-col px-2 gap-4 ">
                      <div className="flex flex-col">
                          <label className="text-base text-gray-800 font-medium mb-1">Descrição</label>
                          <input name="descricao" defaultValue={despesa.descricao} className="border border-gray-300 rounded-md px-2 py-2 text-gray-600 text-sm font-normal" required />
                      </div>
                      <div className="flex flex-col max-w-20">
                          <label className="text-base font-medium mb-1 text-gray-800">Valor</label>
                          <input name="valor" type="number" step="0.01" defaultValue={despesa.valor} className="border border-gray-300 rounded-md px-2 py-2 text-gray-600 text-sm font-normal" required />
                      </div>

                      <div className="flex flex-col">
                        <label className="text-base text-gray-800 font-medium mb-1">Tipo</label>
                        <select name="tipo" defaultValue={despesa.tipo} className="border border-gray-300 bg-white rounded-md px-2 py-2 text-gray-600 text-sm font-normal">
                            <option value="despesa">Despesa</option>
                            <option value="receita">Receita</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex flex-col p-2 gap-2 pt-6">
                      <div>
                        <button type="submit" className="w-full py-3 rounded-md bg-violet-700 text-white font-semibold ">Salvar Alterações</button>
                      </div>
                      <div>
                        <button type="button" onClick={() => handleDeletar(despesa)} className="w-full font-semibold text-red-500 py-3 border  border-red-500 rounded-md ">Excluir </button>
                      </div>
                    </div>
                  </form>
                )}

                {acaoAberta === 'pagar' && (
                  <form onSubmit={(e) => handlePagar(e, despesa)} className="animate-fade-in">
                      <div className="flex flex-col px-2 pb-4 gap-4 ">
                          <div className="flex flex-col">
                              <label className="text-base font-medium mb-1 text-gray-800">Valor a Pagar</label>
                              <input name="valor_pago" type="number" step="0.01" defaultValue={despesa.valor} max={despesa.valor} className="border border-gray-300 rounded-lg px-2 py-2  text-gray-600 text-sm font-normal" required />
                          </div>
                          <div className="flex flex-col">
                              <label className="text-base font-medium mb-1 text-gray-800">Carteira</label>
                              <select name="id_carteira" className="border border-gray-300 bg-white rounded-lg px-2 py-2 text-sm font-normal  text-gray-600" required>
                                  <option value="">Selecione...</option>
                                  {carteiras.map(c => <option key={c.id} value={c.id}>{c.nome} R$ {c.saldo_atual}</option>)}
                              </select>
                          </div>
                      </div>
                      <div className="flex">
                          <button type="submit" className=" w-full m-2 bg-violet-700 text-white py-3 font-semibold rounded-md">Confirmar Pagamento</button>
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
