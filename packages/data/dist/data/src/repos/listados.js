import { db } from "../db";
export async function listarUltimasOrdenes(limit = 50) {
    const ordenes = await db.ordenes.orderBy("fecha_creacion").reverse().limit(limit).toArray();
    const aparatos = await db.aparatos.where("id").anyOf(ordenes.map(o => o.aparato_id)).toArray();
    const clientes = await db.clientes.where("id").anyOf(aparatos.map(a => a.cliente_id)).toArray();
    const mapA = new Map(aparatos.map(a => [a.id, a]));
    const mapC = new Map(clientes.map(c => [c.id, c]));
    return ordenes.map(o => {
        const ap = mapA.get(o.aparato_id);
        const cl = ap ? mapC.get(ap.cliente_id) : undefined;
        return { ...o, aparato: ap, cliente: cl };
    });
}
export async function obtenerOrdenDetallada(id) {
    const o = await db.ordenes.get(id);
    if (!o)
        return;
    const ap = await db.aparatos.get(o.aparato_id);
    const cl = ap ? await db.clientes.get(ap.cliente_id) : undefined;
    return { ...o, aparato: ap, cliente: cl };
}
