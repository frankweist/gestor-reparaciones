import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { Listados } from "@core/data";
import { useSeleccion } from "../../store/seleccion";
export function Historial() {
    const [items, setItems] = useState([]);
    const [q, setQ] = useState("");
    const { setOrdenId } = useSeleccion();
    useEffect(() => { Listados.listarUltimasOrdenes(200).then(setItems); }, []);
    const filtrados = useMemo(() => {
        const t = q.trim().toLowerCase();
        if (!t)
            return items;
        return items.filter(o => {
            const n = o.cliente?.nombre?.toLowerCase() || "", mo = o.aparato?.modelo?.toLowerCase() || "", ma = o.aparato?.marca?.toLowerCase() || "";
            return o.codigo_orden.toLowerCase().includes(t) || n.includes(t) || mo.includes(t) || ma.includes(t);
        });
    }, [items, q]);
    return (_jsxs("div", { className: "grid gap-3", children: [_jsx("h2", { className: "h1", children: "Historial de \u00F3rdenes" }), _jsx("input", { className: "input", placeholder: "Buscar por c\u00F3digo, cliente, marca o modelo", value: q, onChange: e => setQ(e.target.value) }), _jsx("div", { className: "overflow-auto", children: _jsxs("table", { className: "min-w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "text-left border-b", children: [_jsx("th", { className: "py-2 pr-4", children: "C\u00F3digo" }), _jsx("th", { className: "py-2 pr-4", children: "Cliente" }), _jsx("th", { className: "py-2 pr-4", children: "Equipo" }), _jsx("th", { className: "py-2 pr-4", children: "Estado" }), _jsx("th", { className: "py-2 pr-4", children: "Acciones" })] }) }), _jsxs("tbody", { children: [filtrados.map(o => (_jsxs("tr", { className: "border-b last:border-0", children: [_jsx("td", { className: "py-2 pr-4 font-medium", children: o.codigo_orden }), _jsx("td", { className: "py-2 pr-4", children: o.cliente?.nombre ?? "—" }), _jsx("td", { className: "py-2 pr-4", children: o.aparato ? `${o.aparato.marca} ${o.aparato.modelo}` : "—" }), _jsx("td", { className: "py-2 pr-4", children: o.estado }), _jsx("td", { className: "py-2 pr-4", children: _jsx("button", { className: "btn", onClick: () => { setOrdenId(o.id); window.scrollTo({ top: 0, behavior: "smooth" }); }, children: "Seleccionar" }) })] }, o.id))), filtrados.length === 0 && _jsx("tr", { children: _jsx("td", { colSpan: 5, className: "py-4 text-gray-500", children: "Sin resultados." }) })] })] }) })] }));
}
