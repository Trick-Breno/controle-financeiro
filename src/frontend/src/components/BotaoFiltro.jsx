export function BotaoFiltro({children, selecionado, onClick}) {
    const baseClasses = "text-base  border rounded-lg flex px-5 py-1  ";
    const stateClasses = selecionado
    ? "text-violet-700  border-2 border-violet-500"
    : "text-gray-800 border-gray-600 ";

    return (
        <button onClick={onClick} className={`${baseClasses} ${stateClasses}`}>
            {children}
        </button>
    );
}