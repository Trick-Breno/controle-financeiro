import { useEffect, useState } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from "@clerk/clerk-react";
import { listarCarteiras } from "../services/carteira";

export default function Dashboard() {
  const [carteiras, setCarteiras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const { getToken } = useAuth();

  useEffect(() => {
    const buscarDados = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const dados = await listarCarteiras(token);

        setCarteiras(dados);

      } catch (error) {
        setErro(error.message);
      } finally {
        setLoading(false);
      }
    };

    buscarDados();
  }, [getToken]);

  return (
    <div className="p-8 min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      
      <SignedOut>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Bem-vindo ao Controle Financeiro</h1>
          <p className="text-gray-600 mb-6">Faça login para acessar suas finanças.</p>
          <div className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer inline-block">
            <SignInButton mode="modal" />
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h1 className="text-2xl font-bold text-blue-600">Meu Painel</h1>
            <UserButton /> 
          </div>
          
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
                  <li key={carteira.id} className="p-4 border rounded shadow-sm flex justify-between">
                    <span className="font-medium">{carteira.nome}</span>
                    <span className="text-green-600 font-bold">
                      R$ {Number(carteira.saldo_atual).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </SignedIn>

    </div>
  );
}