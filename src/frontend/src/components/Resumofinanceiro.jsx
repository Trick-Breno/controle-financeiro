import { useMovimentacoes } from "../contexts/MovimentacoesContext";

const ResumoFinanceiro = () => {
    const { resumoDespesas } = useMovimentacoes();

    return (
        <div className="mx-6 mt-2 px-4 shadow-md rounded-xl border border-gray-200 bg-white divide-y divide-gray-300">
            <div className="flex w-full gap-4 py-3 px-4 justify-between">
                <h2 className="text-lg font-medium text-gray-800">Saldo</h2>
                <span className="text-lg font-medium text-green-500">R$ 575.00</span>
            </div>    
            
            <ul className="space-y-2 py-3 px-4">
                <li className="flex gap-6 justify-between">
                    <span className="text-sm text-gray-700">Despesas</span>
                    <span className="text-sm text-gray-700">R$ {Number(resumoDespesas.total).toFixed(2)}</span>
                </li>
                <li className="flex gap-6 justify-between">
                    <span className="text-sm text-gray-600">Pago</span>
                    <span className="text-sm text-gray-600">R$ {Number(resumoDespesas.pago).toFixed(2)}</span>
                </li>
                <li className="flex gap-6 justify-between">
                    <span className="text-sm text-gray-700">Pendente</span>
                    <span className="text-sm text-red-500">R$ {Number(resumoDespesas.falta).toFixed(2)}</span>
                </li>
            </ul>
        </div>
    );
};

export default ResumoFinanceiro;