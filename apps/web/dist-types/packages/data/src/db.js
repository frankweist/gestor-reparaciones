import Dexie from "dexie";
export class GRDB extends Dexie {
    constructor() {
        super("gestor_reparaciones");
        this.version(1).stores({
            clientes: "id, nombre, telefono, email, fecha_alta",
            categorias_aparatos: "id, nombre, activo",
            aparatos: "id, cliente_id, categoria_id, marca, modelo, numero_serie",
            ordenes: "id, aparato_id, codigo_orden, estado, fecha_creacion",
            inspecciones: "id, orden_id",
            presupuestos: "id, orden_id",
            piezas: "id, orden_id, estado",
            progresos: "id, orden_id, fecha",
            componentes_reemplazados: "id, orden_id",
            facturas: "id, orden_id, numero_factura",
            pagos: "id, factura_id",
            ajustes: "id"
        });
    }
}
export const db = new GRDB();
