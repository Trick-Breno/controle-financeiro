import { useState, useEffect } from "react";
import { Card } from "./ui/Card"; 
import { CardForm } from "./ui/CardForm";
import { CampoForm } from "./ui/CampoForm";
import { Botao } from "./ui/Botao";

export function ItemDespesa({ 
  despesa, 
  carteiras, 
  isOpen, 
  onToggle, 
  onEditar, 
  onPagar, 
  onDeletar 
}) {
    
    const [acaoAberta, setAcaoAberta] = useState("pagar");

    useEffect(() => {
    if (isOpen) {
        setAcaoAberta("pagar");
    }
    }, [isOpen]);

    const renderizarStatus = (status) => {
        let cor = '';
        if (status === 'concluido') cor = 'bg-green-500';
        else if (status === 'pendente') cor = 'bg-red-500';

        return (
            <div className="flex items-center justify-center" title={status}>
                <span className={`w-2 h-2 rounded-full shadow-sm ${cor}`}></span>
            </div>
        );
    };

    return (
        <Card>
            <div className="flex items-center justify-between cursor-pointer" onClick={onToggle}>
                <div className="font-medium flex flex-wrap">
                    <span>{despesa.descricao}</span>
                </div>
                <div className="flex items-center justify-center gap-2 font-semibold">
                    <span>R${despesa.valor}</span>
                    <span>{renderizarStatus(despesa.status)}</span>
                </div>
            </div>

            {/*expansão do card*/}
            {isOpen && (
                <div>                
                    <div className="flex border-t border-gray-200 mt-4 pt-2 justify-center w-full">
                        <div className="flex bg-white">
                            <button
                            type="button"
                            className={`py-1 px-6 flex-1 text-base font-medium ${acaoAberta === 'pagar' ? 'text-violet-700 border-b-2 border-violet-500' : 'text-gray-700 border-b border-gray-200'}`}
                            onClick={() => setAcaoAberta('pagar')}
                            > 
                            Pagar
                            </button>
                            <button                      
                            type="button"
                            className={`py-1 px-6 flex-1 text-base font-medium ${acaoAberta === 'editar' ? 'text-violet-700 border-b-2 border-violet-500' : 'text-gray-700 border-b border-gray-200'}`}
                            onClick={() => setAcaoAberta('editar')}
                            > 
                            Editar
                            </button>
                        </div>
                    </div>

                    {acaoAberta === 'editar' && (
                        <CardForm onSubmit={(e) => onEditar(e, despesa.id)} >
                            <CampoForm label="Descrição" tipoElemento="input" type="text" name="descricao" defaultValue={despesa.descricao} required />
                            <CampoForm label="Valor" tipoElemento="input" type="number" name="valor" step="0.01" defaultValue={despesa.valor} required />
                            <div className="flex flex-col mt-2 gap-2">
                            <Botao type="submit">Salvar Alterações</Botao>
                            <Botao variante="perigo" type="button" onClick={() => onDeletar(despesa)} >Excluir</Botao>
                            </div>
                        </CardForm>
                    )}

                    {acaoAberta === 'pagar' && (
                        <CardForm onSubmit={(e) => onPagar(e, despesa)}>
                            <CampoForm label="Valor" tipoElemento="input" type="number" name="valor_pago" step="0.01" required />
                            <CampoForm label="Carteira" tipoElemento="select" name="id_carteira" required>
                                <option value="">Selecione</option>
                            {carteiras.map(c => <option key={c.id} value={c.id}>{c.nome} R$ {c.saldo_atual}</option>)}
                            </CampoForm>                        
                            <div className="flex flex-col mt-2">
                                <Botao type="submit">Confirmar Pagamento</Botao>
                            </div>
                        </CardForm>    
                    )}
                </div>
            )}
        </Card>
    );
}