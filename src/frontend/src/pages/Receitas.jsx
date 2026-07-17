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
        <div className=" ">
            <h1 className="font-semibold text-xl text-center text-gray-800">Receitas</h1>
            <form onSubmit={(e) => handleCriar(e)}>
                <div className="flex flex-col my-4 px-4 py-2 border-b-2 rounded-xl shadow-sm  bg-white">
                    <h2 className=" text-lg text-gray-800">Adicionar Receita</h2>
                    <div className=" pt-4 pb-2 gap-4 flex flex-col">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-800">Nome</label>
                            <input type="text" name="descricao" required className="text-gray-800 w-full p-2 border  border-gray-400  rounded-md" /></div>
                        <div className="flex flex-col items-baseline gap-1 ">
                            <label className="text-sm text-gray-800">Valor</label>
                            <input type="number" step="0.01" name="valor" required className="w-full text-gray-800 p-2 border rounded-md  border-gray-400  "/></div>
                        <div className="flex flex-col items-baseline gap-1 ">
                            <label className="text-sm text-gray-800">Carteira</label>
                            <select name="id_carteira" className="text-gray-800 p-2 border border-gray-400 bg-white  rounded-md">
                            <option value="">Selecione</option>
                            {carteiras.map((c) => (
                                <option key={c.id} value={c.id}>{c.nome}</option>))}
                        </select></div>
                        
                    </div>
                    <button type="submit" className=" my-4 py-2 px-6 font-semibold bg-violet-700 rounded-md text-white"> Salvar</button>
                </div>
            </form>
            <div className="rounded-xl bg-white py-4">
                {carteiras.map((carteira) => {
                    const receitasDaCarteira = receitas.filter(r => r.id_carteira === carteira.id);
                    return (
                        <div className="flex flex-col py-1 px-4 " key={carteira.id}>
                            <h3 className=" font-bold  text-gray-800 bg-gray-100">{carteira.nome}</h3>
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