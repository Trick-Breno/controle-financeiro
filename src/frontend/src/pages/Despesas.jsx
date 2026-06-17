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

      <div className="w-full flex flex-col gap- ">
        {despesasFiltradas.map((despesa) => (
          <div className={`${itemAberto === despesa.id ? `${" mx-4 font-medium bg-gray-50 border border-violet-500 rounded-xl"}` : `${" mx-4 font-medium "}` } }`}key={despesa.id}>

            <div className={`${itemAberto === despesa.id ? `${" p-4 text-gray-700 flex items-center gap-2 justify-between"}` : `${"bg-white text-gray-600 border-b border-gray-200 p-4 flex items-center gap-2 justify-between"}` } }`}
 
              onClick={() => toggleItem(despesa.id)} >

              <div className="">
                <span>{despesa.descricao}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm  ">
                <span>R$ {despesa.valor}</span>
                <span>{renderizarStatus(despesa.status) }</span>

              </div>
            </div>

            {itemAberto === despesa.id && (
              <div className=" rounded-b-2xl border-t border-gray-200 bg-white">                

              <div className="flex p-1 pb-4 justify-center w-full">
                <div className="flex  bg-white ">
                  <button
                    className={`${acaoAberta === 'pagar' ? `${" py-1 px-4 flex-1 text-sm  text-violet-700 border-b-2  border-violet-500 "}`: `${" py-1 px-4 text-gray-500 text-sm border-b  border-gray-200  "}`}}`}
                    onClick={() => setAcaoAberta('pagar')}
                    > Pagar
                  </button>
                  <button                      
                    className={`${acaoAberta === 'editar' ?`${" py-1 px-4 flex-1 text-sm  text-violet-700 border-b-2  border-violet-500 "}`: `${" py-1 px-4 text-gray-500 text-sm border-b  border-gray-200 "}`}}`}
                    onClick={() => setAcaoAberta('editar')}
                    > Editar
                  </button>
                </div>
              </div>

                {acaoAberta === 'editar' && (
                  <form onSubmit={(e) => handleEditar(e, despesa.id)} className="animate-fade-in">
                    <div className="flex flex-wrap px-4 gap-2 ">
                      <div className="flex flex-col pb-2">
                          <label className="text-xs text-gray-600 mb-1">Descrição</label>
                          <input name="descricao" defaultValue={despesa.descricao} className="border border-gray-300 rounded px-2 py-1.5 text-sm" required />
                      </div>
                      <div className="flex flex-col max-w-20">
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
                    <div className="flex flex-col p-2 gap-2 pt-6">
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
                      <div className="px-4 pb-4 grid grid-cols-2 gap-4 ">
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
                      <div className="flex">
                          <button type="submit" className="text-sm w-full m-2 bg-violet-700 text-white py-2 rounded-md">Confirmar Pagamento</button>
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