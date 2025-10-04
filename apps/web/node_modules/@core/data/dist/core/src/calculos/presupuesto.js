export function calcularPresupuesto(input) {
    const tarifa = input.dificultad === "basica" ? input.tarifas.basica :
        input.dificultad === "media" ? input.tarifas.media : input.tarifas.compleja;
    const horas = Math.max(0, Number.isFinite(input.horasEstimadas) ? input.horasEstimadas : 0);
    const piezas = Math.max(0, Number.isFinite(input.costoPiezas) ? input.costoPiezas : 0);
    const subtotalManoObra = tarifa * horas;
    const subtotal = subtotalManoObra + piezas;
    const total = subtotal; // SIN IVA
    const alertas = [];
    if (total > 0.7 * input.precioRefNuevo)
        alertas.push("supera_70_por_ciento_nuevo");
    if (input.precioRefSegundaMano != null && total > input.precioRefSegundaMano)
        alertas.push("supera_precio_segunda_mano");
    if (total >= input.precioRefNuevo)
        alertas.push("no_viable_vs_nuevo");
    return { subtotalManoObra, subtotal, total, alertas };
}
