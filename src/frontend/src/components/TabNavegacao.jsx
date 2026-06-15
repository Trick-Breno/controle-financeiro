export function TabNavegacao({children, selecionado, onClick}) {
    return (
        <button 
            onClick={onClick} 
            className={`${
            selecionado
            ? 'py-2  flex-1 text-sm font-semibold text-violet-700 border-b-2 border-violet-500  '
            : 'py-2  flex-1 text-sm font-semibold text-gray-500 border-b-2' }`}>
                {children}
        </button>
    )
}