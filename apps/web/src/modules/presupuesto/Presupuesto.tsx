import { useEffect, useMemo, useState } from "react";
import { calcularPresupuesto, Dificultad, Heuristica } from "@core/domain";
import { useSeleccion } from "../../store/seleccion";
import { Listados } from "@core/data";

export function Presupuesto(){
  const { ordenId } = useSeleccion();
  const [info, setInfo] = useState<{codigo?:string; cliente?:string; equipo?:string; categoria?:string; marca?:string; modelo?:string; descripcion?:string}>({});

  useEffect(()=>{ if(!ordenId){ setInfo({}); return; }
    Listados.obtenerOrdenDetallada(ordenId).then(o=>{
      if(!o) return setInfo({});
      setInfo({
        codigo:o.codigo_orden,
        cliente:o.cliente?.nombre,
        equipo:o.aparato?`${o.aparato.marca} ${o.aparato.modelo}`:undefined,
        categoria: (o as any).aparato?.categoria || "", // si no tienes el nombre guarda cadena vacía
        marca: o.aparato?.marca,
        modelo: o.aparato?.modelo,
        descripcion: (o as any).aparato?.descripcion_danio_inicial
      });
    });
  },[ordenId]);

  const [dificultad, setDificultad] = useState<Dificultad>("basica");
  const [horas, setHoras] = useState(1);
  const [costoPiezas, setCostoPiezas] = useState(0);
  const [nuevo, setNuevo] = useState(100);
  const [segunda, setSegunda] = useState<number|undefined>(undefined);
  const [tarifas] = useState({ basica:25, media:35, compleja:50 });

  const r = useMemo(()=>calcularPresupuesto({
    dificultad, horasEstimadas: horas, costoPiezas, tarifas,
    precioRefNuevo: nuevo, precioRefSegundaMano: segunda
  }),[dificultad,horas,costoPiezas,tarifas,nuevo,segunda]);

  const sugerir = ()=>{
    const sug = Heuristica.sugerirDificultadYPrecio({
      categoria: info.categoria || "",
      marca: info.marca, modelo: info.modelo, descripcion: info.descripcion
    });
    setDificultad(sug.dificultad);
    setSegunda(sug.precioSegundaMano);
  };

  const imprimir = ()=>{
    const w = window.open("", "printwin"); if(!w) return;
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
    w.document.close(); w.focus(); w.print(); w.close();
  };

  return (
    <div className="grid gap-2">
      <h2 className="text-xl font-semibold">Presupuesto inicial</h2>
      <p className="text-sm text-gray-600">
        {info.codigo ? <>Orden <b>{info.codigo}</b> · Cliente <b>{info.cliente ?? "—"}</b> · Equipo <b>{info.equipo ?? "—"}</b></> : "Selecciona una orden en Historial."}
      </p>

      <div className="grid md:grid-cols-2 gap-2">
        <label> Dificultad
          <select className="input" value={dificultad} onChange={e=>setDificultad(e.target.value as any)}>
            <option value="basica">Básica</option><option value="media">Media</option><option value="compleja">Compleja</option>
          </select>
        </label>
        <label> Horas estimadas
          <input type="number" className="input" value={horas} onChange={e=>setHoras(parseFloat(e.target.value)||0)}/>
        </label>
        <label> Costo piezas
          <input type="number" className="input" value={costoPiezas} onChange={e=>setCostoPiezas(parseFloat(e.target.value)||0)}/>
        </label>
        <label> Precio ref. nuevo*
          <input type="number" className="input" value={nuevo} onChange={e=>setNuevo(parseFloat(e.target.value)||0)}/>
        </label>
        <label> Precio ref. 2ª mano
          <input type="number" className="input" value={segunda ?? ""} onChange={e=>setSegunda(e.target.value ? parseFloat(e.target.value) : undefined)}/>
        </label>
      </div>

      <div className="border p-3 rounded-xl bg-white">
        <p>Subtotal mano de obra: <b>{r.subtotalManoObra.toFixed(2)}</b></p>
        <p>Total: <b>{r.total.toFixed(2)}</b></p>
        {r.alertas.length>0 && (
          <ul className="mt-2">
            {r.alertas.includes("supera_70_por_ciento_nuevo") && <li className="text-amber-600">Alerta: supera el 70% del precio nuevo.</li>}
            {r.alertas.includes("supera_precio_segunda_mano") && <li className="text-orange-600">Sugerencia: supera el precio de 2ª mano.</li>}
            {r.alertas.includes("no_viable_vs_nuevo") && <li className="text-red-600">No viable: supera el precio del equipo nuevo.</li>}
          </ul>
        )}
        <div className="flex gap-2 mt-2">
          <button className="btn" onClick={sugerir}>Sugerir dificultad y 2ª mano</button>
          <button className="btn" onClick={imprimir}>Imprimir presupuesto</button>
        </div>
      </div>
    </div>
  );
}
