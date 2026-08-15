export function Card({children}) {
    return (
        <div className="p-4 flex flex-col text-base bg-white shadow-sm  rounded-xl">
            {children}
        </div>
    );
}