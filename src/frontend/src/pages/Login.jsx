import { SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export default function Login() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      
      {/* Se o usuário NÃO estiver logado, mostra o botão */}
      <SignedOut>
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Controle Financeiro</h1>
          <p className="text-gray-600 mb-6">Faça login para acessar o sistema.</p>
          <div className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer inline-block">
            <SignInButton mode="modal" />
          </div>
        </div>
      </SignedOut>

      {/* Se o usuário JÁ estiver logado e tentar acessar /login, manda ele pro Dashboard */}
      <SignedIn>
        <Navigate to="/" replace />
      </SignedIn>
      
    </div>
  );
}