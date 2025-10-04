import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuid } from "uuid";
import { db, Remote } from "@core/data";
import type { CategoriaAparato, Cliente, Aparato, Orden } from "@core/domain";
import { useSeleccion } from "../../store/seleccion";

const esquema = z.object({
  nombre: z.string().min(2),
  telefono: z.string().min(6),
  email: z.string().email().optional(),
  categoria: z.string(),
  marca: z.string().min(1),
  modelo: z.string().min(1),
  numero_serie: z.string().optional(),
  descripcion_danio_inicial: z.string().min(3),
});
type FormData = z.infer<typeof esquema>;

const CATS = [
  "Móviles y smartphones","Ordenadores","Consolas de videojuegos","Televisores","Baterías de litio",
  "Seascooters","Máquinas a batería","Robots de piscina","Robots aspiradores","Placas electrónicas genéricas","Otros dispositivos electrónicos"
];

export function Registro(){
  const { register, handleSubmit, reset, formState:{errors} } = useForm<FormData>({ resolver: zodResolver(esquema) });
  const setOrdenId = useSeleccion(s=>s.setOrdenId);

  const onSubmit = async (d:FormData)=>{
    const ahora = new Date().toISOString();
    const cliente: Cliente = { id: uuid(), nombre: d.nombre, telefono: d.telefono, email: d.email, fecha_alta: ahora };
    const cat: CategoriaAparato = { id: uuid(), nombre: d.categoria, es_personalizada: !CATS.includes(d.categoria), activo: true };
    const aparato: Aparato = {
      id: uuid(), cliente_id: cliente.id, categoria_id: cat.id, marca: d.marca, modelo: d.modelo,
      numero_serie: d.numero_serie, descripcion_danio_inicial: d.descripcion_danio_inicial, fecha_recepcion: ahora
    };
    const orden: Orden = {
      id: uuid(), aparato_id: aparato.id, codigo_orden: `ORD-${Date.now()}`, estado: "recepcion",
      fecha_creacion: ahora, fecha_actualizacion: ahora
    };

    await db.transaction("rw", db.clientes, db.categorias_aparatos, db.aparatos, db.ordenes, async ()=>{
      await db.clientes.add(cliente);
      await db.categorias_aparatos.add(cat);
      await db.aparatos.add(aparato);
      await db.ordenes.add(orden);
    });

    try {
      await Remote.Clientes.upsert(cliente);
      await Remote.Categorias.upsert(cat);
      await Remote.AparatosRepo.upsert(aparato);
      await Remote.OrdenesRepo.upsert(orden);
    } catch(e) {
      console.warn("No se pudo sincronizar con Supabase:", e);
    }

    setOrdenId(orden.id);
    reset();
    alert("Orden creada: "+orden.codigo_orden);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
      <h2 className="h1">Registro Cliente y Aparato</h2>
      <input placeholder="Nombre*" {...register("nombre")} className="input"/>
      <input placeholder="Teléfono*" {...register("telefono")} className="input"/>
      <input placeholder="Email" {...register("email")} className="input"/>
      <select {...register("categoria")} className="input">
        {CATS.map(c=> <option key={c} value={c}>{c}</option>)}
        <option value="Personalizada">Añadir personalizada…</option>
      </select>
      <input placeholder="Marca*" {...register("marca")} className="input"/>
      <input placeholder="Modelo*" {...register("modelo")} className="input"/>
      <input placeholder="Nº de serie" {...register("numero_serie")} className="input"/>
      <textarea placeholder="Daño inicial*" {...register("descripcion_danio_inicial")} className="input"/>
      {Object.values(errors).length>0 && <p className="text-red-600">Revisa los campos obligatorios.</p>}
      <button className="btn btn-primary">Crear orden</button>
    </form>
  );
}
