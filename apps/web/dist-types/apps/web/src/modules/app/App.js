import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Registro } from "../registro/Registro";
import { Presupuesto } from "../presupuesto/Presupuesto";
import { DetalleOrden } from "../reparacion/DetalleOrden";
import { Historial } from "../historial/Historial";
import { useSeleccion } from "../../store/seleccion";
import { Listados } from "@core/data";
export function App() {
    const [vista, setVista] = useState("registro");
    const { ordenId } = useSeleccion();
    const [resumen, setResumen] = useState({});
    useEffect(() => {
        if (!ordenId) {
            setResumen({});
            return;
        }
        Listados.obtenerOrdenDetallada(ordenId).then(o => {
            if (!o)
                return setResumen({});
            setResumen({
                codigo: o.codigo_orden,
                cliente: o.cliente?.nombre,
                equipo: o.aparato ? `${o.aparato.marca} ${o.aparato.modelo}` : undefined
            });
        });
    }, [ordenId]);
    return (_jsxs("div", { className: "container space-y-4", children: [_jsxs("header", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "h1", children: "Gestor de Reparaciones" }), _jsxs("nav", { className: "tabs", children: [_jsx("button", { className: `tab ${vista === 'registro' ? 'tab-active' : ''}`, onClick: () => setVista("registro"), children: "Registro" }), _jsx("button", { className: `tab ${vista === 'presupuesto' ? 'tab-active' : ''}`, onClick: () => setVista("presupuesto"), children: "Presupuesto" }), _jsx("button", { className: `tab ${vista === 'detalle' ? 'tab-active' : ''}`, onClick: () => setVista("detalle"), children: "Reparaci\u00F3n" }), _jsx("button", { className: `tab ${vista === 'historial' ? 'tab-active' : ''}`, onClick: () => setVista("historial"), children: "Historial" })] })] }), resumen.codigo && (_jsxs("div", { className: "card text-sm", children: [_jsx("b", { children: "Orden activa:" }), " ", resumen.codigo, " \u00B7 ", _jsx("b", { children: "Cliente:" }), " ", resumen.cliente ?? "—", " \u00B7 ", _jsx("b", { children: "Equipo:" }), " ", resumen.equipo ?? "—"] })), vista === "registro" && _jsx("section", { className: "card", children: _jsx(Registro, {}) }), vista === "presupuesto" && _jsx("section", { className: "card", children: _jsx(Presupuesto, {}) }), vista === "detalle" && _jsx("section", { className: "card", children: _jsx(DetalleOrden, {}) }), vista === "historial" && _jsx("section", { className: "card", children: _jsx(Historial, {}) })] }));
}
