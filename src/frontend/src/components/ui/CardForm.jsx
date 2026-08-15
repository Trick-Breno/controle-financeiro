import { Botao } from "./Botao";

export function CardForm({titulo, onSubmit, children}) {
    return (
        <form onSubmit={onSubmit}>
            <div className="flex flex-col py-2  rounded-xl  bg-white">
                {titulo && <h2 className="text-lg text-gray-800">{titulo}</h2>}
                <div className="pt-4 pb-2 gap-4 flex flex-col">
                    {children}
                </div>
            </div>
        </form>
    );
}