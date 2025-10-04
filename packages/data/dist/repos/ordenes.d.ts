import type { Orden } from "@core/domain";
export declare function crearOrden(base: Omit<Orden, "id" | "fecha_creacion" | "fecha_actualizacion">): Promise<Orden>;
export declare function actualizarEstado(orden_id: string, estado: Orden["estado"]): Promise<void>;




