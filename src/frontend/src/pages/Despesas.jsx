import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import api from "../services/api";
import { useMovimentacoes } from "../contexts/MovimentacoesContext";
import { useCarteiras } from "../contexts/CarteirasContext";
import { BotaoFiltro } from "../components/ui/BotaoFiltro";
import Header from "../components/Header";
import { Container } from "../components/ui/Container";
import { ItemDespesa } from "../components/ItemDespesa";

export function Despesas() {
  const {carregarMovimentacoes, despesas, resumoDespesas, loading } = useMovimentacoes();
  const {carregarCarteiras, carteiras} = useCarteiras();
  const [filtroAtivo, setFiltroAtivo] = useState("pendente");
  const [itemAberto, setItemAberto] = useState(null);


  const { getToken, userId } = useAuth();


  if (loading) return <p>Carregando...</p>;

  const despesasFiltradas = despesas.filter((d) => {
    if (filtroAtivo === "todas") {
      return true; }
    else {
      return d.status === filtroAtivo;
    }
    
  })

  const toggleItem = (id) => {
      setItemAberto(itemAberto === id  ? null : id);
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
    <Container>
      <h1 className="font-semibold text-xl text-center text-gray-800">Despesas</h1>
      <div className=" pb-4 pt-6 flex w-full gap-1 ">
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
        <div className="flex flex-col ">
          <div className="grid grid-cols-12 mt-2">
            <input type="text" name="descricao" className="col-span-7 shadow-sm p-1 py-2 border border-gray-300  rounded-lg rounded-r-none " placeholder="Nome" required/>
            <input type="number" step="0.01" name="valor" className=" col-span-3 shadow-sm pl-2 py-2 border border-gray-300 border-l-0 rounded-l-none " placeholder="R$" required />   
          <div className="col-span-2">
            <button type="submit" className="text-2xl shadow-sm font-bold  bg-violet-700 text-white w-full  py-1 rounded-lg rounded-l-none ">+</button>
          </div>
          </div>
        </div>
      </form>

      {despesasFiltradas.map((despesa) => (
        <ItemDespesa 
          key={despesa.id}
          despesa={despesa}
          carteiras={carteiras}
          isOpen={itemAberto === despesa.id}
          onToggle={() => toggleItem(despesa.id)}
          onEditar={handleEditar}
          onPagar={handlePagar}
          onDeletar={handleDeletar}
        />
      ))}
    </Container>
  );
}