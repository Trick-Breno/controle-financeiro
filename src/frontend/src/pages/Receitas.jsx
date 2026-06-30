import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import api from "../services/api";
import { useMovimentacoes } from "../contexts/MovimentacoesContext";
import { useCarteiras } from "../contexts/CarteirasContext";

export default function Receitas() {
    const {carregarMovimentacoes, receitas} = useMovimentacoes();
    const {carregarCarteiras, carteiras} = useCarteiras();
    const {getToken, userId} = useAuth();

    const handleCriar = async(e) => {
        e.preventDefault();

        const dados = Object.fromEntries(new FormData(e.target));
        const dataHoje = new Date().toISOString().split('T')[0];

        try{
            const token = await getToken();

            const resposta = await api.post(`movimentacoes/`, {
                descricao: dados.descricao,
                valor: Number(dados.valor),
                tipo: 'receita',
                id_carteira: dados.id_carteira,
                status: 'concluido',
                data_referencia: dataHoje
            },{headers: {Authorization: `Bearer ${token}`}});

            e.target.reset();

            await carregarMovimentacoes();
            await carregarCarteiras();
        } catch (error) {
            console.error("Erro ao criar receita", error);
            alert(JSON.stringify(error.response?.data || error.messsage ));
        }
    };

    return (
        <div className="">
            <form onSubmit={(e) => handleCriar(e)}>
                <div className="p-4 pb-8 grid grid-cols-12">
                    <input type="text" name="descricao" placeholder="Descricao" required className="col-span-4 p-1 border  border-gray-600  rounded-l-lg" />
                    <input type="number" name="valor" placeholder="Valor" required className="col-span-2 p-1 border-y  border-gray-600  "/>
                    <select name="id_carteira" className="col-span-4 p-1 border  border-gray-600 bg-white  rounded-r-lg">
                        <option value="">Selecione</option>
                        {carteiras.map((c) => (
                            <option key={c.id} value={c.id}>{c.nome}</option>))}
                    </select>
                    <button type="submit" className="col-span-2 mx-2 font-bold bg-violet-700 rounded-md text-white"> adc</button>
                </div>
            </form>
            <div>
                {carteiras.map((carteira) => {
                    const receitasDaCarteira = receitas.filter(r => r.id_carteira === carteira.id);
                    return (
                        <div className="flex flex-col mb-4 px-6 +" key={carteira.id}>
                            <h3 className="text-xl font-bold  text-gray-800">{carteira.nome}</h3>
                            <div className=""> 
                                {receitasDaCarteira.map((receita) => (
                                    <div className="flex justify-between py-1 font-medium text-gray-800" key={receita.id}>
                                        <span>{receita.descricao}</span>
                                        <span>R$ {receita.valor}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}