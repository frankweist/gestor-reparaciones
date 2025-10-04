import { useEffect, useMemo, useState } from "react";
import { Listados } from "@core/data";
import { useSeleccion } from "../../store/seleccion";

export function Historial(){
  const [items, setItems] = useState<Awaited<ReturnType<typeof Listados.listarUltimasOrdenes>>>([]);
  const [q, setQ] = useState("");
  const { setOrdenId } = useSeleccion();

  useEffect(()=>{ Listados.listarUltimasOrdenes(200).then(setItems); }, []);

  const filtrados = useMemo(()=>{
    const t = q.trim().toLowerCase(); if(!t) return items;
    return items.filter(o=>{
      const n=o.cliente?.nombre?.toLowerCase()||"", mo=o.aparato?.modelo?.toLowerCase()||"", ma=o.aparato?.marca?.toLowerCase()||"";
      return o.codigo_orden.toLowerCase().includes(t)||n.includes(t)||mo.includes(t)||ma.includes(t);
    });
  },[items,q]);

  return (
    <div className="grid gap-3">
      <h2 className="h1">Historial de órdenes</h2>
      <input className="input" placeholder="Buscar por código, cliente, marca o modelo" value={q} onChange={e=>setQ(e.target.value)} />
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead><tr className="text-left border-b">
            <th className="py-2 pr-4">Código</th><th className="py-2 pr-4">Cliente</th>
            <th className="py-2 pr-4">Equipo</th><th className="py-2 pr-4">Estado</th><th className="py-2 pr-4">Acciones</th>
          </tr></thead>
          <tbody>
            {filtrados.map(o=>(
              <tr key={o.id} className="border-b last:border-0">
                <td className="py-2 pr-4 font-medium">{o.codigo_orden}</td>
                <td className="py-2 pr-4">{o.cliente?.nombre ?? "—"}</td>
                <td className="py-2 pr-4">{o.aparato ? `${o.aparato.marca} ${o.aparato.modelo}` : "—"}</td>
                <td className="py-2 pr-4">{o.estado}</td>
                <td className="py-2 pr-4">
                  <button className="btn" onClick={()=>{ setOrdenId(o.id); window.scrollTo({top:0,behavior:"smooth"}); }}>
                    Seleccionar
                  </button>
                </td>
              </tr>
            ))}
            {filtrados.length===0 && <tr><td colSpan={5} className="py-4 text-gray-500">Sin resultados.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
