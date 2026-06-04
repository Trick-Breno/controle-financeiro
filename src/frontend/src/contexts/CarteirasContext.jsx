import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { useAuth } from "@clerk/clerk-react";
import api from "../services/api";

const CarteirasContext = createContext({});

export function CarteirasProvider({children}) {
    const { getToken, userId } = useAuth();

    const [carteiras, setCarteiras] = useState([]);
    const [loading, setLoading] = useState(false);

    const carregarCarteiras = useCallback(async () => {
        if(!userId) return;
        
        setLoading(true)
        try {
            const token = await getToken();
            const resposta = await api.get("/carteiras", {
                headers: { Authorization: `Bearer ${token}`}
            });
            setCarteiras(resposta || []);
        } catch (error) {
            console.error("Erro ao carregar carteiras", error);
        } finally {
            setLoading(false);
        }
    }, [getToken, userId]);

    useEffect(() => {
        carregarCarteiras();
    }, [carregarCarteiras]);

    const saldoCarteiras = carteiras.reduce((acc, c) => {
        const valor = Number(c.saldo_atual );
        acc.total += valor;
        return acc;
    }, {total: 0});

    return (
        <CarteirasContext.Provider value={{
            saldoCarteiras,
            carteiras,
            loading,
            carregarCarteiras
        }}>
            {children}
        </CarteirasContext.Provider>
    );
};

export const useCarteiras = () => {
    const contexto = useContext(CarteirasContext);

    if (!contexto) {
        throw new Error("useCarteiras deve ser usado dentro de um CarteirasProvider");
    }
    return contexto;
};