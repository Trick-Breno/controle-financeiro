import { useEffect, useState } from "react";
import { useAuth, UserButton } from "@clerk/clerk-react";
import { listarCarteiras } from "../services/carteira";
import { listarDespesas } from "../services/despesa";

export default function Dashboard() {
  const [carteiras, setCarteiras] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const { getToken } = useAuth();

  useEffect(() => {
    const buscarDados = async () => {
      setLoading(true);
              
      try {
          const token = await getToken();
          const responseCarteiras = await listarCarteiras(token);
          setCarteiras(responseCarteiras);
        } catch (error) {
          setErro(error.message);
        } finally {
          setLoading(false);
      }

      try {
        const token = await getToken();
        const responseDespesas = await listarDespesas(token);
        setDespesas(responseDespesas);
      } catch (error) {
        setErro(error.message);
      } finally {
        setLoading(false);
      }

    };

    buscarDados();
  }, [getToken]);

  return (
    <div className="p-8 min-h-screen bg-gray-50 flex justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl h-fit">
        
        {/* Conteúdo: Minhas Carteiras */}
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-4">Minhas Carteiras</h2>
          
          {loading && <p className="text-gray-500">Carregando carteiras...</p>}
          
          {erro && <p className="text-red-500 font-bold">Erro: {erro}</p>}
          
          {!loading && !erro && carteiras.length === 0 && (
            <p className="text-gray-500">Você ainda não tem carteiras cadastradas.</p>
          )}

          {!loading && !erro && carteiras.length > 0 && (
            <ul className="space-y-3">
              {carteiras.map((carteira) => (
                <li key={carteira.id} className=" flex justify-between">
                  <span className="font-medium">{carteira.nome}</span>
                  <span className="text-green-600 font-bold">
                    R$ {Number(carteira.saldo_atual).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-4">Minhas Despesas</h2>
          
          {loading && <p className="text-gray-500">Carregando Despesas...</p>}
          
          {erro && <p className="text-red-500 font-bold">Erro: {erro}</p>}
          
          {!loading && !erro && despesas.length === 0 && (
            <p className="text-gray-500">Você ainda não tem carteiras cadastradas.</p>
          )}

          {!loading && !erro && despesas.length > 0 && (
            <ul className="space-y-3">
              {despesas.map((despesa) => (
                <li key={despesa.id} className="flex justify-between">
                  <span className="font-medium">{despesa.descricao}</span>
                  <span className="text-green-600 font-bold">
                    {despesa.valor}
                    {/*R$ {Number(carteira.saldo_atual).toFixed(2)}*/}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}