import React from "react";

const classesBase = "my-1 py-2 px-6 font-semibold rounded-md "

const estilosVariaveis = {
    primario: "bg-violet-700 text-white",
    perigo: "text-red-500 border  border-red-500",
};

export function Botao({variante ='primario', children, ...props}) {

    const  classeVariante = estilosVariaveis[variante];
    return (
        <button className={`${classesBase} ${classeVariante}`}{...props}>
            {children}
        </button>
    );
}