export function CampoForm({label, tipoElemento = "input", children, ...props}) {
    const estiloCampo = "border border-gray-400 rounded-md p-2 text-gray-800 bg-white w-full outline-none focus:border-violet-700 focus:ring-1 focus:ring-violet-700";

    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <label className="text-sm font-medium text-gray-800 mb-1">
                    {label}
                </label>
            )}

            {tipoElemento === "select" ? (
                <select className={estiloCampo} {...props}>
                    {children}
                </select>
            ) : (
                <input className={estiloCampo} {...props} />
            )}
        </div>
    );


    
}