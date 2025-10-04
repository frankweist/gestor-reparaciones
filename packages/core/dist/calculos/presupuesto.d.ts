import type { Dificultad } from "../tipos";
export declare function calcularPresupuesto(input: {
    dificultad: Dificultad;
    horasEstimadas: number;
    costoPiezas: number;
    tarifas: {
        basica: number;
        media: number;
        compleja: number;
    };
    precioRefNuevo: number;
    precioRefSegundaMano?: number;
}): {
    subtotalManoObra: number;
    subtotal: number;
    total: number;
    alertas: string[];
};
