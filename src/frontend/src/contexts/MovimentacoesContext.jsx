import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import api from "../services/api";

const MovimentacoesContext = createContext({});

export function MovimentacoesProvider({children}) {
    const { getToken, userId } = useAuth();

    const [movimentacoes, setMovimentacoes] = useState([]);
    const [loading, setLoading] = useState(false);

    const carregarMovimentacoes = useCallback(async () => {
        if (!userId) return;

        setLoading(true);
        try {
            const token =  await getToken();
            const resposta = await api.get("/movimentacoes", {
                headers: { Authorization: `Bearer ${token}`}
            });
            setMovimentacoes(resposta || []);
        } catch (error) {
            console.error("Erro ao carregar movimentações", error);
        } finally {
            setLoading(false);
        }
    }, [getToken, userId]);

    useEffect(() => {
        carregarMovimentacoes();
    }, [carregarMovimentacoes]);

    const despesas = movimentacoes.filter(m => m.tipo === 'despesa');

    const resumoDespesas = despesas.reduce((acc, d) => {
        const valor = Number( d.valor);
        if (d.status === "concluido") acc.pago += valor;
        else acc.falta += valor;
        acc.total += valor;
        return acc;
    }, { total: 0, pago: 0, falta: 0 });

    return (
        <MovimentacoesContext.Provider value={{
            movimentacoes,
            despesas,
            resumoDespesas,
            loading,
            carregarMovimentacoes
        }}>
            {children}
        </MovimentacoesContext.Provider>
    );
}

export const useMovimentacoes = () => {
    const contexto = useContext(MovimentacoesContext);

    if (!contexto) {
        throw new Error("useMovimentacoes deve ser usado dentro de um MovimentacoesProvider");
    }

    return contexto;
};