import { db } from "../db";
import { v4 as uuid } from "uuid";
export async function crear(data) {
    const id = uuid();
    const ahora = new Date().toISOString();
    const t = { id, fecha_creacion: ahora, fecha_actualizacion: ahora, ...data };
    await db.tickets_trabajo.add(t);
    return t;
}
export async function actualizar(id, patch) {
    const ahora = new Date().toISOString();
    await db.tickets_trabajo.update(id, { ...patch, fecha_actualizacion: ahora });
}
export async function listar(opts) {
    let coll = db.tickets_trabajo.orderBy("fecha_creacion").reverse();
    const arr = await coll.toArray();
    const t = (opts?.q || "").toLowerCase();
    return arr.filter(x => {
        if (opts?.estado && x.estado !== opts.estado)
            return false;
        if (opts?.habitacion && x.habitacion !== opts.habitacion)
            return false;
        if (t && !(x.fallo.toLowerCase().includes(t) || (x.detalle || "").toLowerCase().includes(t) || x.habitacion.toLowerCase().includes(t)))
            return false;
        return true;
    }).slice(0, opts?.limit ?? 200);
}
