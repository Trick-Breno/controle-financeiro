import { useState } from "react";
import Despesas from "./Despesas";
import Receitas from "./Receitas";
import { TabNavegacao } from "../components/TabNavegacao";

export default function Movimentacoes() {
    const [abaAberta, setAbaAberta] = useState("despesas");

    return (
        <div className="w-full">
            <div className="mx-4 mt-2 flex border rounded-xl bg-white shadow-sm">
                <TabNavegacao selecionado={abaAberta === 'despesas'} onClick={() => setAbaAberta('despesas')}>
                    Despesas
                </TabNavegacao>
                <TabNavegacao selecionado={abaAberta === 'receitas'} onClick={() => setAbaAberta('receitas')}>
                    Receitas
                </TabNavegacao>
            </div>
            <div className="mt-2">
                {abaAberta === 'despesas' ? (<Despesas />) : (<Receitas />)}
            </div>
        </div>
    );
}