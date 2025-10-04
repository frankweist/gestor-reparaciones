import { db } from "../db";
import { v4 as uuid } from "uuid";
import type { Orden } from "@core/domain";

export async function crearOrden(base: Omit<Orden,"id"|"fecha_creacion"|"fecha_actualizacion">) {
  const id = uuid();
  const ahora = new Date().toISOString();
  const data: Orden = { id, fecha_creacion: ahora, fecha_actualizacion: ahora, ...base };
  await db.ordenes.add(data);
  return data;
}
export async function actualizarEstado(orden_id: string, estado: Orden["estado"]) {
  const ahora = new Date().toISOString();
  await db.ordenes.update(orden_id, { estado, fecha_actualizacion: ahora });
}




