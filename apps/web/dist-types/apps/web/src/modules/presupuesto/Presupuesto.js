import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { calcularPresupuesto, Heuristica } from "@core/domain";
import { useSeleccion } from "../../store/seleccion";
import { Listados } from "@core/data";
export function Presupuesto() {
    const { ordenId } = useSeleccion();
    const [info, setInfo] = useState({});
    useEffect(() => {
        if (!ordenId) {
            setInfo({});
            return;
        }
        Listados.obtenerOrdenDetallada(ordenId).then(o => {
            if (!o)
                return setInfo({});
            setInfo({
                codigo: o.codigo_orden,
                cliente: o.cliente?.nombre,
                equipo: o.aparato ? `${o.aparato.marca} ${o.aparato.modelo}` : undefined,
                categoria: o.aparato?.categoria || "", // si no tienes el nombre guarda cadena vacía
                marca: o.aparato?.marca,
                modelo: o.aparato?.modelo,
                descripcion: o.aparato?.descripcion_danio_inicial
            });
        });
    }, [ordenId]);
    const [dificultad, setDificultad] = useState("basica");
    const [horas, setHoras] = useState(1);
    const [costoPiezas, setCostoPiezas] = useState(0);
    const [nuevo, setNuevo] = useState(100);
    const [segunda, setSegunda] = useState(undefined);
    const [tarifas] = useState({ basica: 25, media: 35, compleja: 50 });
    const r = useMemo(() => calcularPresupuesto({
        dificultad, horasEstimadas: horas, costoPiezas, tarifas,
        precioRefNuevo: nuevo, precioRefSegundaMano: segunda
    }), [dificultad, horas, costoPiezas, tarifas, nuevo, segunda]);
    const sugerir = () => {
        const sug = Heuristica.sugerirDificultadYPrecio({
            categoria: info.categoria || "",
            marca: info.marca, modelo: info.modelo, descripcion: info.descripcion
        });
        setDificultad(sug.dificultad);
        setSegunda(sug.precioSegundaMano);
    };
    const imprimir = () => {
        const w = window.open("", "printwin");
        if (!w)
            return;
        w.document.write(`
      <html><head><meta charset="utf-8"><title>Presupuesto ${info.codigo ?? ""}</title>
      <style>
        body{font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;padding:24px}
        h1{font-size:20px;margin:0 0 8px}
        table{border-collapse:collapse;width:100%;margin-top:12px}
        td,th{border:1px solid #ddd;padding:8px;text-align:left}
      </style></head><body>
      <h1>Presupuesto</h1>
      <div><b>Orden:</b> ${info.codigo ?? "—"}<br/>
           <b>Cliente:</b> ${info.cliente ?? "—"}<br/>
           <b>Equipo:</b> ${info.equipo ?? "—"}</div>
      <table>
        <tr><th>Detalle</th><th>Importe (€)</th></tr>
        <tr><td>Mano de obra (${horas}h · ${dificultad})</td><td>${r.subtotalManoObra.toFixed(2)}</td></tr>
        <tr><td>Piezas</td><td>${costoPiezas.toFixed(2)}</td></tr>
        <tr><td><b>Total</b></td><td><b>${r.total.toFixed(2)}</b></td></tr>
      </table>
      </body></html>
    `);
        w.document.close();
        w.focus();
        w.print();
        w.close();
    };
    return (_jsxs("div", { className: "grid gap-2", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Presupuesto inicial" }), _jsx("p", { className: "text-sm text-gray-600", children: info.codigo ? _jsxs(_Fragment, { children: ["Orden ", _jsx("b", { children: info.codigo }), " \u00B7 Cliente ", _jsx("b", { children: info.cliente ?? "—" }), " \u00B7 Equipo ", _jsx("b", { children: info.equipo ?? "—" })] }) : "Selecciona una orden en Historial." }), _jsxs("div", { className: "grid md:grid-cols-2 gap-2", children: [_jsxs("label", { children: [" Dificultad", _jsxs("select", { className: "input", value: dificultad, onChange: e => setDificultad(e.target.value), children: [_jsx("option", { value: "basica", children: "B\u00E1sica" }), _jsx("option", { value: "media", children: "Media" }), _jsx("option", { value: "compleja", children: "Compleja" })] })] }), _jsxs("label", { children: [" Horas estimadas", _jsx("input", { type: "number", className: "input", value: horas, onChange: e => setHoras(parseFloat(e.target.value) || 0) })] }), _jsxs("label", { children: [" Costo piezas", _jsx("input", { type: "number", className: "input", value: costoPiezas, onChange: e => setCostoPiezas(parseFloat(e.target.value) || 0) })] }), _jsxs("label", { children: [" Precio ref. nuevo*", _jsx("input", { type: "number", className: "input", value: nuevo, onChange: e => setNuevo(parseFloat(e.target.value) || 0) })] }), _jsxs("label", { children: [" Precio ref. 2\u00AA mano", _jsx("input", { type: "number", className: "input", value: segunda ?? "", onChange: e => setSegunda(e.target.value ? parseFloat(e.target.value) : undefined) })] })] }), _jsxs("div", { className: "border p-3 rounded-xl bg-white", children: [_jsxs("p", { children: ["Subtotal mano de obra: ", _jsx("b", { children: r.subtotalManoObra.toFixed(2) })] }), _jsxs("p", { children: ["Total: ", _jsx("b", { children: r.total.toFixed(2) })] }), r.alertas.length > 0 && (_jsxs("ul", { className: "mt-2", children: [r.alertas.includes("supera_70_por_ciento_nuevo") && _jsx("li", { className: "text-amber-600", children: "Alerta: supera el 70% del precio nuevo." }), r.alertas.includes("supera_precio_segunda_mano") && _jsx("li", { className: "text-orange-600", children: "Sugerencia: supera el precio de 2\u00AA mano." }), r.alertas.includes("no_viable_vs_nuevo") && _jsx("li", { className: "text-red-600", children: "No viable: supera el precio del equipo nuevo." })] })), _jsxs("div", { className: "flex gap-2 mt-2", children: [_jsx("button", { className: "btn", onClick: sugerir, children: "Sugerir dificultad y 2\u00AA mano" }), _jsx("button", { className: "btn", onClick: imprimir, children: "Imprimir presupuesto" })] })] })] }));
}
