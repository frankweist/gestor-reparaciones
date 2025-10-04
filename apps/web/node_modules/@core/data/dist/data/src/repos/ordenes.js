import { db } from "../db";
import { v4 as uuid } from "uuid";
export async function crearOrden(base) {
    const id = uuid();
    const ahora = new Date().toISOString();
    const data = { id, fecha_creacion: ahora, fecha_actualizacion: ahora, ...base };
    await db.ordenes.add(data);
    return data;
}
export async function actualizarEstado(orden_id, estado) {
    const ahora = new Date().toISOString();
    await db.ordenes.update(orden_id, { estado, fecha_actualizacion: ahora });
}
