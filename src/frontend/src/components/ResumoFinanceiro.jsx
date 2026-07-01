import { useMovimentacoes } from "../contexts/MovimentacoesContext";
import { useCarteiras } from "../contexts/CarteirasContext";

export default function ResumoFinanceiro()  {
    const { resumoDespesas } = useMovimentacoes();
    const { saldoCarteiras } = useCarteiras();

    return (
        <div className="mx-10 mt-2 px-4 shadow-md rounded-xl border border-gray-200 bg-white divide-y divide-gray-300">

            {/* Bloco do Saldo (Protegido) */}
            <div className="flex w-full gap-4 py-3 px-4 justify-between">
                <h2 className="text-xl font-medium text-gray-800">Saldo</h2>
                <span className="text-xl font-medium text-green-500">
                    R$ {Number(saldoCarteiras?.total || 0).toFixed(2)}
                </span>
            </div>    
            
            {/* Lista de Totais (Adicionado os ?. para evitar o crash inicial) */}
            <ul className="space-y-2 py-3 px-4">
                <li className="flex gap-6 justify-between">
                    <span className="text-base text-gray-700">Despesas</span>
                    <span className="text-base text-gray-700">
                        R$ {Number(resumoDespesas?.total || 0).toFixed(2)}
                    </span>
                </li>
                <li className="flex gap-6 justify-between">
                    <span className="text-base text-gray-700">Pendente</span>
                    <span className="text-base text-red-500">
                        R$ {Number(resumoDespesas?.falta || 0).toFixed(2)}
                    </span>
                </li>
            </ul>

        </div>
    );
}
