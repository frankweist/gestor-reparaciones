export type UUID = string;
export type Dificultad = "basica" | "media" | "compleja";
export interface Cliente {
    id: UUID;
    nombre: string;
    telefono: string;
    email?: string;
    documento_id?: string;
    direccion?: string;
    notas?: string;
    fecha_alta: string;
}
export interface CategoriaAparato {
    id: UUID;
    nombre: string;
    es_personalizada: boolean;
    activo: boolean;
}
export interface Aparato {
    id: UUID;
    cliente_id: UUID;
    categoria_id: UUID;
    marca: string;
    modelo: string;
    numero_serie?: string;
    descripcion_danio_inicial: string;
    accesorios_entregados?: string[];
    estado_estetico?: string;
    fecha_recepcion: string;
}
export type EstadoOrden = "recepcion" | "inspeccion" | "presupuestado" | "en_reparacion" | "espera_piezas" | "listo" | "facturado" | "entregado" | "cancelado";
export interface Orden {
    id: UUID;
    aparato_id: UUID;
    codigo_orden: string;
    estado: EstadoOrden;
    tecnico_asignado?: string;
    fecha_creacion: string;
    fecha_actualizacion: string;
    fecha_entrega_prevista?: string;
    prioridad?: "baja" | "media" | "alta";
}
export interface Inspeccion {
    id: UUID;
    orden_id: UUID;
    observaciones_visual: string;
    fotos_adjuntas?: string[];
    riesgo_bateria_litio?: boolean;
    humedad_detectada?: boolean;
    clasificacion_dificultad: Dificultad;
    horas_estimadas: number;
}
export interface Presupuesto {
    id: UUID;
    orden_id: UUID;
    precio_ref_nuevo: number;
    precio_ref_segunda_mano?: number;
    tarifa_hora_basica: number;
    tarifa_hora_media: number;
    tarifa_hora_compleja: number;
    horas_estimadas: number;
    costo_piezas: number;
    subtotal_mano_obra: number;
    subtotal: number;
    iva_porcentaje: number;
    iva_importe: number;
    total: number;
    alertas: string[];
    aprobado_por_cliente?: boolean;
    fecha_aprobacion?: string;
    observaciones_cliente?: string;
}
export interface Pieza {
    id: UUID;
    orden_id: UUID;
    referencia?: string;
    descripcion: string;
    proveedor?: string;
    cantidad: number;
    costo_unitario: number;
    estado: "solicitada" | "recibida" | "instalada" | "devuelta";
}
export interface Progreso {
    id: UUID;
    orden_id: UUID;
    fecha: string;
    tipo: "diagnostico" | "reparacion" | "prueba" | "pausa" | "nota";
    detalle: string;
    horas_invertidas?: number;
    adjuntos?: string[];
}
export interface ComponenteReemplazado {
    id: UUID;
    orden_id: UUID;
    ubicacion: string;
    componente: string;
    valor?: string;
    motivo_cambio?: string;
    prueba_funcional?: string;
}
export interface Factura {
    id: UUID;
    orden_id: UUID;
    numero_factura: string;
    fecha_emision: string;
    base_imponible: number;
    iva_porcentaje: number;
    iva_importe: number;
    total: number;
    forma_pago: "efectivo" | "tarjeta" | "transferencia" | "otros";
    pdf_url?: string;
}
export interface Pago {
    id: UUID;
    factura_id: UUID;
    fecha: string;
    importe: number;
    metodo: string;
    referencia?: string;
}
export interface Ajustes {
    id: number;
    moneda: string;
    iva_por_defecto: number;
    tarifas: {
        basica: number;
        media: number;
        compleja: number;
    };
    nombre_taller: string;
    nif?: string;
    direccion?: string;
    telefono?: string;
    email?: string;
    pie_factura?: string;
}
