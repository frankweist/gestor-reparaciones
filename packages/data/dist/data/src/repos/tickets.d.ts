import type { TicketTrabajo, EstadoTicket } from "@core/domain";
export declare function crear(data: Omit<TicketTrabajo, "id" | "fecha_creacion" | "fecha_actualizacion">): Promise<TicketTrabajo>;
export declare function actualizar(id: string, patch: Partial<TicketTrabajo>): Promise<void>;
export declare function listar(opts?: {
    estado?: EstadoTicket;
    habitacion?: string;
    q?: string;
    limit?: number;
}): Promise<TicketTrabajo[]>;
