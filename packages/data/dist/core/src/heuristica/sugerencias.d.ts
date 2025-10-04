import type { Dificultad } from "../tipos";
/** Heurística local simple, sin internet. */
export declare function sugerirDificultadYPrecio(params: {
    categoria: string;
    marca?: string;
    modelo?: string;
    descripcion?: string;
}): {
    dificultad: Dificultad;
    precioSegundaMano: number;
};
