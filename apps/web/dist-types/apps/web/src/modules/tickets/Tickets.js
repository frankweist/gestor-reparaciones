import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { TicketsRepo } from "@core/data";
const ESTADOS = ["pendiente_revision", "pendiente_reparacion", "en_reparacion", "resuelto", "cerrado"];
const fmt = (s) => s.replace(/_/g, " ");
export function Tickets() {
    const [habitacion, setHabitacion] = useState("");
    const [fallo, setFallo] = useState("");
    const [detalle, setDetalle] = useState("");
    const [prioridad, setPrioridad] = useState("media");
    const [estado, setEstado] = useState("pendiente_revision");
    const [q, setQ] = useState("");
    const [fEstado, setFEstado] = useState("");
    const [lista, setLista] = useState([]);
    const cargar = async () => setLista(await TicketsRepo.listar({ estado: fEstado || undefined, q, limit: 500 }));
    useEffect(() => { cargar(); }, []);
    useEffect(() => { cargar(); }, [q, fEstado]);
    const crear = async (e) => {
        e.preventDefault();
        if (!habitacion || !fallo)
            return alert("Habitación y fallo son obligatorios.");
        await TicketsRepo.crear({ habitacion, fallo, detalle, prioridad, estado });
        setHabitacion("");
        setFallo("");
        setDetalle("");
        setPrioridad("media");
        setEstado("pendiente_revision");
        await cargar();
    };
    const cambiarEstado = async (id, nuevo) => { await TicketsRepo.actualizar(id, { estado: nuevo }); await cargar(); };
    return (_jsxs("div", { className: "grid gap-4", children: [_jsx("h2", { className: "h1", children: "Tickets de trabajo" }), _jsxs("form", { onSubmit: crear, className: "grid md:grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "label", children: "Habitaci\u00F3n" }), _jsx("input", { className: "input", value: habitacion, onChange: e => setHabitacion(e.target.value), placeholder: "Ej. 101" })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Prioridad" }), _jsxs("select", { className: "input", value: prioridad, onChange: e => setPrioridad(e.target.value), children: [_jsx("option", { value: "baja", children: "Baja" }), _jsx("option", { value: "media", children: "Media" }), _jsx("option", { value: "alta", children: "Alta" })] })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "label", children: "Fallo" }), _jsx("input", { className: "input", value: fallo, onChange: e => setFallo(e.target.value), placeholder: "Descripci\u00F3n breve del fallo" })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "label", children: "Detalle" }), _jsx("textarea", { className: "input", value: detalle, onChange: e => setDetalle(e.target.value), placeholder: "Notas adicionales" })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Estado" }), _jsx("select", { className: "input", value: estado, onChange: e => setEstado(e.target.value), children: ESTADOS.map(s => _jsx("option", { value: s, children: fmt(s) }, s)) })] }), _jsx("div", { className: "flex items-end", children: _jsx("button", { className: "btn btn-primary", type: "submit", children: "A\u00F1adir ticket" }) })] }), _jsxs("div", { className: "grid md:grid-cols-3 gap-3", children: [_jsx("input", { className: "input", placeholder: "Buscar por habitaci\u00F3n o texto", value: q, onChange: e => setQ(e.target.value) }), _jsxs("select", { className: "input", value: fEstado, onChange: e => setFEstado(e.target.value), children: [_jsx("option", { value: "", children: "Todos los estados" }), ESTADOS.map(s => _jsx("option", { value: s, children: fmt(s) }, s))] }), _jsx("button", { className: "btn", onClick: cargar, children: "Actualizar" })] }), _jsx("div", { className: "overflow-auto", children: _jsxs("table", { className: "min-w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "text-left border-b", children: [_jsx("th", { className: "py-2 pr-4", children: "Habitaci\u00F3n" }), _jsx("th", { className: "py-2 pr-4", children: "Fallo" }), _jsx("th", { className: "py-2 pr-4", children: "Prioridad" }), _jsx("th", { className: "py-2 pr-4", children: "Estado" }), _jsx("th", { className: "py-2 pr-4", children: "Creado" }), _jsx("th", { className: "py-2 pr-4", children: "Acciones" })] }) }), _jsxs("tbody", { children: [lista.map(t => (_jsxs("tr", { className: "border-b last:border-0", children: [_jsx("td", { className: "py-2 pr-4 font-medium", children: t.habitacion }), _jsx("td", { className: "py-2 pr-4", children: t.fallo }), _jsx("td", { className: "py-2 pr-4", children: t.prioridad ?? "—" }), _jsx("td", { className: "py-2 pr-4", children: fmt(t.estado) }), _jsx("td", { className: "py-2 pr-4", children: new Date(t.fecha_creacion).toLocaleString() }), _jsx("td", { className: "py-2 pr-4", children: _jsx("div", { className: "flex gap-2 flex-wrap", children: ESTADOS.filter(s => s !== t.estado).map(s => (_jsx("button", { className: "btn", onClick: () => cambiarEstado(t.id, s), type: "button", children: fmt(s) }, s))) }) })] }, t.id))), lista.length === 0 && _jsx("tr", { children: _jsx("td", { colSpan: 6, className: "py-4 text-gray-500", children: "Sin tickets." }) })] })] }) })] }));
}
