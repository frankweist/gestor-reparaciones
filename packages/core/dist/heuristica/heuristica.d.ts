/** Heurística local y simple. No usa internet. */
export declare function sugerirDificultadYPrecio(params: {
    categoria: string;
    marca?: string;
    modelo?: string;
    descripcion?: string;
}): {
    dificultad: Dificultad;
    precioSegundaMano: number;
};
