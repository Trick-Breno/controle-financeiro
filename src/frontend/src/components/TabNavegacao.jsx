export function TabNavegacao({children, selecionado, onClick}) {
    return (
        <button 
            onClick={onClick} 
            className={`${
            selecionado
            ? 'py-1  flex-1 text-sm text-violet-700 border border-violet-300 rounded-2xl  bg-violet-100'
            : 'py-1  flex-1 text-sm text-gray-700' }`}>
                {children}
        </button>
    )
}