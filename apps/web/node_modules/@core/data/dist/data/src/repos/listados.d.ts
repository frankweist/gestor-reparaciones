import type { Orden, Cliente, Aparato } from "@core/domain";
export type OrdenConCliente = Orden & {
    cliente?: Cliente;
    aparato?: Aparato;
};
export declare function listarUltimasOrdenes(limit?: number): Promise<OrdenConCliente[]>;
export declare function obtenerOrdenDetallada(id: string): Promise<OrdenConCliente | undefined>;
