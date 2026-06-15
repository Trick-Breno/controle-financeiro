export function BotaoFiltro({children, selecionado, onClick}) {
    const baseClasses = "text-sm  border rounded-lg flex px-5 py-1  ";
    const stateClasses = selecionado
    ? "text-violet-700  border-2 border-violet-500"
    : "text-gray-500 ";

    return (
        <button onClick={onClick} className={`${baseClasses} ${stateClasses}`}>
            {children}
        </button>
    );
}