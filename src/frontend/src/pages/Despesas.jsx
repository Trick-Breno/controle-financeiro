// Exemplo de como a sua página vai ficar usando o Contexto:
import { useMovimentacoes } from "../contexts/MovimentacoesContext";
import  Header from "../components/Header";

export default function Despesas() {
  // Você abre a torneira e pega SÓ o que essa tela precisa:
  const { despesas, resumoDespesas, loading } = useMovimentacoes();

  if (loading) return <p>Carregando...</p>;

  return (

    <div className="px-4 gap-4">
        <div className="flex gap-2  ">
            <button className="px-5 py-1 rounded-xl bg-gray-100">pendentes</button>
            <button className="px-5 py-1 border border-violet-900 rounded-xl bg-violet-50 text-violet-900">pagas</button>
            <button className="px-5 py-1 rounded-xl bg-gray-100">todas</button>
        </div>
        <div className="py-4">
            <ul class="divide-y divide-gray-300">
                <li>Falta Pagar: R$ {resumoDespesas.falta}</li>
                <li>Pago: R$ {resumoDespesas.pago}</li>
                <li>total: R$ {resumoDespesas.total}</li>
            </ul>
        </div>
    </div>
  );
}