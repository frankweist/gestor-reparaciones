/** Heurística local simple, sin internet. */
export function sugerirDificultadYPrecio(params) {
    const cat = (params.categoria || "").toLowerCase();
    const desc = (params.descripcion || "").toLowerCase();
    let dificultad = "media";
    if (/pantalla|conector|bater[ií]a.*cambio|teclado/.test(desc))
        dificultad = "basica";
    if (/placa|cortocircuito|no enciende|agua|oxidaci[oó]n|soldadura/.test(desc))
        dificultad = "compleja";
    if (/diagn[oó]stico|intermitente/.test(desc))
        dificultad = "media";
    // Precio 2ª mano orientativo por categoría (EUR)
    let base = 100;
    if (cat.includes("móvil") || cat.includes("smartphone"))
        base = 120;
    else if (cat.includes("ordenador") || cat.includes("portátil") || cat.includes("pc"))
        base = 250;
    else if (cat.includes("consola"))
        base = 180;
    else if (cat.includes("televisor"))
        base = 220;
    else if (cat.includes("baterías") || cat.includes("bateria"))
        base = 80;
    else if (cat.includes("robot"))
        base = 200;
    else if (cat.includes("seascooter"))
        base = 300;
    if ((params.marca || "").toLowerCase().match(/apple|dyson|samsung/))
        base *= 1.2;
    const precioSegundaMano = Math.round(base);
    return { dificultad, precioSegundaMano };
}
