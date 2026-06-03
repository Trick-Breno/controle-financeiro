export function BotaoFiltro({children, selecionado, onClick}) {
    const baseClasses = "text-sm flex px-5 py-1 rounded-xl border border-violet-300";
    const stateClasses = selecionado
    ? "text-violet-700 bg-violet-100"
    : "text-gray-700";

    return (
        <button 
            onClick={onClick}
            className={`${baseClasses} ${stateClasses}`}>
            {children}
        </button>
    );
}