import { useState, useEffect } from "react";
import { Registro } from "../registro/Registro";
import { Presupuesto } from "../presupuesto/Presupuesto";
import { DetalleOrden } from "../reparacion/DetalleOrden";
import { Historial } from "../historial/Historial";
import { useSeleccion } from "../../store/seleccion";
import { Listados } from "@core/data";

export function App(){
  const [vista, setVista] = useState<"registro"|"presupuesto"|"detalle"|"historial">("registro");
  const { ordenId } = useSeleccion();
  const [resumen, setResumen] = useState<{codigo?:string; cliente?:string; equipo?:string}>({});

  useEffect(()=>{ 
    if(!ordenId){ setResumen({}); return; }
    Listados.obtenerOrdenDetallada(ordenId).then(o=>{
      if(!o) return setResumen({});
      setResumen({
        codigo: o.codigo_orden,
        cliente: o.cliente?.nombre,
        equipo: o.aparato ? `${o.aparato.marca} ${o.aparato.modelo}` : undefined
      });
    });
  },[ordenId]);

  return (
    <div className="container space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="h1">Gestor de Reparaciones</h1>
        <nav className="tabs">
          <button className={`tab ${vista==='registro'?'tab-active':''}`} onClick={()=>setVista("registro")}>Registro</button>
          <button className={`tab ${vista==='presupuesto'?'tab-active':''}`} onClick={()=>setVista("presupuesto")}>Presupuesto</button>
          <button className={`tab ${vista==='detalle'?'tab-active':''}`} onClick={()=>setVista("detalle")}>Reparación</button>
          <button className={`tab ${vista==='historial'?'tab-active':''}`} onClick={()=>setVista("historial")}>Historial</button>
        </nav>
      </header>

      {resumen.codigo && (
        <div className="card text-sm">
          <b>Orden activa:</b> {resumen.codigo} · <b>Cliente:</b> {resumen.cliente ?? "—"} · <b>Equipo:</b> {resumen.equipo ?? "—"}
        </div>
      )}

      {vista==="registro"   && <section className="card"><Registro/></section>}
      {vista==="presupuesto"&& <section className="card"><Presupuesto/></section>}
      {vista==="detalle"    && <section className="card"><DetalleOrden/></section>}
      {vista==="historial"  && <section className="card"><Historial/></section>}
    </div>
  );
}
