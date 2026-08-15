import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import api from "../services/api";
import { useMovimentacoes } from "../contexts/MovimentacoesContext";
import { useCarteiras } from "../contexts/CarteirasContext";
import { Container } from "../components/ui/Container.jsx";
import { Card } from "../components/ui/Card.jsx";
import { CampoForm } from "../components/ui/CampoForm.jsx";
import { Botao } from "../components/ui/Botao.jsx";
import { CardForm } from "../components/ui/CardForm.jsx";


export function Receitas() {
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
        <Container>
            <h1 className="font-semibold text-xl text-center text-gray-800">Receitas</h1>
            <Card>
                <CardForm onSubmit={handleCriar} titulo="Adicionar receita">
                    <CampoForm label="Nome" tipoElemento="input" type="text" name="descricao" required/>
                    <CampoForm label="Valor" tipoElemento="input" type="number" step="0.01" name="valor" required/>
                    <CampoForm label="Carteira" tipoElemento="select" name="id_carteira">
                        <option value="">Selecione</option>
                        {carteiras.map((c) => (
                            <option key={c.id} value={c.id}>{c.nome}</option>))}
                    </CampoForm>
                    <Botao>Salvar</Botao>
                </CardForm>
            </Card>

            <Card>
                {carteiras.map((carteira) => {
                    const receitasDaCarteira = receitas.filter(r => r.id_carteira === carteira.id);
                    return (
                        <div className="flex flex-col py-1 " key={carteira.id}>
                            <div className="flex justify-between font-bold  text-gray-800 bg-gray-100">
                                <h3 className=" ">{carteira.nome}</h3>
                                <span>{carteira.saldo_atual}</span>
                            </div>
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
            </Card>
        </Container>
    );
}