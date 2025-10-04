import { useEffect, useMemo, useState } from "react";
import { db, Listados } from "@core/data";
import type { EstadoOrden } from "@core/domain";
import { useSeleccion } from "../../store/seleccion";

const ESTADOS: EstadoOrden[] = [
  "recepcion","inspeccion","presupuestado","en_reparacion","espera_piezas","listo","facturado","entregado","cancelado"
];

type Info = {
  id?: string;
  codigo?: string;
  cliente?: string;
  equipo?: string;
  estado?: EstadoOrden;
};

export function DetalleOrden(){
  const { ordenId } = useSeleccion();
  const [info, setInfo] = useState<Info>({});
  const [cargando, setCargando] = useState(false);

  // formularios locales
  const [nuevoEstado, setNuevoEstado] = useState<EstadoOrden>("en_reparacion");
  const [progTipo, setProgTipo] = useState<"diagnostico"|"reparacion"|"prueba"|"pausa"|"nota">("nota");
  const [progDetalle, setProgDetalle] = useState("");
  const [progHoras, setProgHoras] = useState<number|undefined>(undefined);

  const [piezaDesc, setPiezaDesc] = useState("");
  const [piezaCant, setPiezaCant] = useState(1);
  const [piezaCoste, setPiezaCoste] = useState(0);

  const [progresos, setProgresos] = useState<any[]>([]);
  const [piezas, setPiezas] = useState<any[]>([]);

  const cargar = async ()=>{
    if(!ordenId){ setInfo({}); setProgresos([]); setPiezas([]); return; }
    setCargando(true);
    const o = await Listados.obtenerOrdenDetallada(ordenId);
    if(!o){ setCargando(false); return; }
    setInfo({
      id: o.id, codigo: o.codigo_orden, estado: o.estado,
      cliente: o.cliente?.nombre,
      equipo: o.aparato ? `${o.aparato.marca} ${o.aparato.modelo}` : undefined,
    });
    const [progs, pzs] = await Promise.all([
      db.progresos.where("orden_id").equals(o.id).reverse().sortBy("fecha"),
      db.piezas.where("orden_id").equals(o.id).toArray()
    ]);
    setProgresos(progs.reverse());
    setPiezas(pzs);
    setNuevoEstado(o.estado);
    setCargando(false);
  };

  useEffect(()=>{ cargar(); /* eslint-disable-next-line */ },[ordenId]);

  const totalHoras = useMemo(()=>progresos.reduce((s,p)=>s+(p.horas_invertidas||0),0),[progresos]);
  const totalPiezas = useMemo(()=>piezas.reduce((s,p)=>s + (p.costo_unitario||0)*(p.cantidad||0),0),[piezas]);

  const cambiarEstado = async ()=>{
    if(!info.id) return;
    await db.ordenes.update(info.id, { estado: nuevoEstado, fecha_actualizacion: new Date().toISOString() });
    await cargar();
  };

  const agregarProgreso = async (e:React.FormEvent)=>{
    e.preventDefault();
    if(!info.id) return;
    if(!progDetalle.trim()) return alert("Detalle requerido.");
    await db.progresos.add({
      id: crypto.randomUUID(),
      orden_id: info.id,
      fecha: new Date().toISOString(),
      tipo: progTipo,
      detalle: progDetalle.trim(),
      horas_invertidas: progHoras
    });
    setProgDetalle("");
    setProgHoras(undefined);
    await cargar();
  };

  const agregarPieza = async (e:React.FormEvent)=>{
    e.preventDefault();
    if(!info.id) return;
    if(!piezaDesc.trim()) return alert("Descripción de pieza requerida.");
    await db.piezas.add({
      id: crypto.randomUUID(),
      orden_id: info.id,
      descripcion: piezaDesc.trim(),
      cantidad: Math.max(1, piezaCant|0),
      costo_unitario: Math.max(0, +piezaCoste),
      estado: "instalada"
    });
    setPiezaDesc(""); setPiezaCant(1); setPiezaCoste(0);
    await cargar();
  };

  if(!ordenId) return <p className="text-sm text-gray-600">Selecciona una orden en Historial.</p>;
  if(cargando) return <p className="text-sm">Cargando…</p>;

  return (
    <div className="grid gap-4">
      <div className="grid md:grid-cols-2 gap-3">
        <div className="card">
          <h3 className="font-semibold mb-2">Resumen</h3>
          <p><b>Orden:</b> {info.codigo ?? "—"}</p>
          <p><b>Cliente:</b> {info.cliente ?? "—"}</p>
          <p><b>Equipo:</b> {info.equipo ?? "—"}</p>
          <div className="mt-3">
            <label className="label">Estado</label>
            <div className="flex gap-2">
              <select className="input" value={nuevoEstado} onChange={e=>setNuevoEstado(e.target.value as EstadoOrden)}>
                {ESTADOS.map(s=><option key={s} value={s}>{s.replace(/_/g," ")}</option>)}
              </select>
              <button className="btn btn-primary" onClick={cambiarEstado} type="button">Actualizar estado</button>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-2">Añadir progreso</h3>
          <form onSubmit={agregarProgreso} className="grid gap-2">
            <div className="grid md:grid-cols-3 gap-2">
              <div>
                <label className="label">Tipo</label>
                <select className="input" value={progTipo} onChange={e=>setProgTipo(e.target.value as any)}>
                  <option value="diagnostico">Diagnóstico</option>
                  <option value="reparacion">Reparación</option>
                  <option value="prueba">Prueba</option>
                  <option value="pausa">Pausa</option>
                  <option value="nota">Nota</option>
                </select>
              </div>
              <div>
                <label className="label">Horas invertidas</label>
                <input className="input" type="number" step="0.1" value={progHoras ?? ""} onChange={e=>setProgHoras(e.target.value? +e.target.value : undefined)} />
              </div>
              <div className="md:col-span-1 flex items-end">
                <button className="btn btn-primary" type="submit">Registrar</button>
              </div>
            </div>
            <textarea className="input" placeholder="Detalle del progreso" value={progDetalle} onChange={e=>setProgDetalle(e.target.value)} />
          </form>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="card">
          <h3 className="font-semibold mb-2">Bitácora</h3>
          <ul className="space-y-2">
            {progresos.map(p=>(
              <li key={p.id} className="border rounded-xl p-2">
                <div className="text-xs text-gray-500">{new Date(p.fecha).toLocaleString()} · {p.tipo}</div>
                <div>{p.detalle}</div>
                {p.horas_invertidas!=null && <div className="text-xs">Horas: {p.horas_invertidas}</div>}
              </li>
            ))}
            {progresos.length===0 && <li className="text-sm text-gray-500">Sin registros.</li>}
          </ul>
          <div className="mt-2 text-sm"><b>Total horas:</b> {totalHoras.toFixed(1)}</div>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-2">Piezas usadas</h3>
          <form onSubmit={agregarPieza} className="grid md:grid-cols-3 gap-2">
            <input className="input md:col-span-2" placeholder="Descripción de la pieza" value={piezaDesc} onChange={e=>setPiezaDesc(e.target.value)} />
            <input className="input" type="number" min={1} value={piezaCant} onChange={e=>setPiezaCant(Math.max(1, +e.target.value||1))} />
            <input className="input" type="number" step="0.01" min={0} value={piezaCoste} onChange={e=>setPiezaCoste(Math.max(0, +e.target.value||0))} />
            <div className="md:col-span-3">
              <button className="btn btn-primary" type="submit">Añadir pieza</button>
            </div>
          </form>

          <table className="min-w-full text-sm mt-3">
            <thead><tr className="text-left border-b"><th className="py-1 pr-2">Descripción</th><th className="py-1 pr-2">Cant.</th><th className="py-1 pr-2">€/u</th><th className="py-1 pr-2">Total</th></tr></thead>
            <tbody>
              {piezas.map(px=>(
                <tr key={px.id} className="border-b last:border-0">
                  <td className="py-1 pr-2">{px.descripcion}</td>
                  <td className="py-1 pr-2">{px.cantidad}</td>
                  <td className="py-1 pr-2">{(px.costo_unitario||0).toFixed(2)}</td>
                  <td className="py-1 pr-2">{((px.costo_unitario||0)*(px.cantidad||0)).toFixed(2)}</td>
                </tr>
              ))}
              {piezas.length===0 && <tr><td colSpan={4} className="py-2 text-gray-500">Sin piezas.</td></tr>}
            </tbody>
          </table>
          <div className="mt-2 text-sm"><b>Coste piezas:</b> {totalPiezas.toFixed(2)} €</div>
        </div>
      </div>
    </div>
  );
}
