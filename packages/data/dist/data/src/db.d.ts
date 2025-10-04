import Dexie, { Table } from "dexie";
import type { Ajustes, Cliente, CategoriaAparato, Aparato, Orden, Inspeccion, Presupuesto, Pieza, Progreso, ComponenteReemplazado, Factura, Pago } from "@core/domain";
export declare class GRDB extends Dexie {
    clientes: Table<Cliente, string>;
    categorias_aparatos: Table<CategoriaAparato, string>;
    aparatos: Table<Aparato, string>;
    ordenes: Table<Orden, string>;
    inspecciones: Table<Inspeccion, string>;
    presupuestos: Table<Presupuesto, string>;
    piezas: Table<Pieza, string>;
    progresos: Table<Progreso, string>;
    componentes_reemplazados: Table<ComponenteReemplazado, string>;
    facturas: Table<Factura, string>;
    pagos: Table<Pago, string>;
    ajustes: Table<Ajustes, number>;
    constructor();
}
export declare const db: GRDB;
