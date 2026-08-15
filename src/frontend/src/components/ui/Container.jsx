export function Container({children}) {
    return (
        <div className="flex flex-col gap-4">
            {children}
        </div>
    );
}