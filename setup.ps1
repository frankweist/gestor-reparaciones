# crear carpetas
$dirs = @(
  "apps/web/public","apps/web/src/modules/app","apps/web/src/modules/registro","apps/web/src/modules/presupuesto","apps/web/src/modules/reparacion",
  "packages/core/src/tipos","packages/core/src/calculos","packages/data/src/repos",".github/workflows","mobile","apps/web/src"
)
$dirs | ForEach-Object { New-Item -ItemType Directory -Force -Path $_ | Out-Null }

@'
{
  "name": "gestor-reparaciones",
  "private": true,
  "version": "0.1.0",
  "workspaces": ["apps/*","packages/*"],
  "scripts": {
    "build": "pnpm -r build",
    "dev": "pnpm --filter @app/web dev"
  },
  "packageManager": "pnpm@9.6.0"
}
'@ | Set-Content -Encoding UTF8 package.json

@'
packages:
  - "apps/*"
  - "packages/*"
'@ | Set-Content -Encoding UTF8 pnpm-workspace.yaml

@'
node_modules
apps/web/dist
mobile/android
mobile/ios
.DS_Store
.env
'@ | Set-Content -Encoding UTF8 .gitignore

@'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@core/domain": ["packages/core/src"],
      "@core/data": ["packages/data/src"]
    }
  }
}
'@ | Set-Content -Encoding UTF8 tsconfig.base.json

@'
{
  "name": "@core/domain",
  "version": "0.1.0",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": { "build": "tsc -p tsconfig.json" },
  "devDependencies": { "typescript": "5.5.4" }
}
'@ | Set-Content -Encoding UTF8 packages/core/package.json

@'
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "outDir": "dist", "declaration": true },
  "include": ["src/**/*"]
}
'@ | Set-Content -Encoding UTF8 packages/core/tsconfig.json

@'
export type UUID = string;
export type Dificultad = "basica" | "media" | "compleja";
export interface Cliente { id: UUID; nombre: string; telefono: string; email?: string; documento_id?: string; direccion?: string; notas?: string; fecha_alta: string; }
export interface CategoriaAparato { id: UUID; nombre: string; es_personalizada: boolean; activo: boolean; }
export interface Aparato { id: UUID; cliente_id: UUID; categoria_id: UUID; marca: string; modelo: string; numero_serie?: string; descripcion_danio_inicial: string; accesorios_entregados?: string[]; estado_estetico?: string; fecha_recepcion: string; }
export type EstadoOrden = "recepcion"|"inspeccion"|"presupuestado"|"en_reparacion"|"espera_piezas"|"listo"|"facturado"|"entregado"|"cancelado";
export interface Orden { id: UUID; aparato_id: UUID; codigo_orden: string; estado: EstadoOrden; tecnico_asignado?: string; fecha_creacion: string; fecha_actualizacion: string; fecha_entrega_prevista?: string; prioridad?: "baja"|"media"|"alta"; }
export interface Inspeccion { id: UUID; orden_id: UUID; observaciones_visual: string; fotos_adjuntas?: string[]; riesgo_bateria_litio?: boolean; humedad_detectada?: boolean; clasificacion_dificultad: Dificultad; horas_estimadas: number; }
export interface Presupuesto { id: UUID; orden_id: UUID; precio_ref_nuevo: number; precio_ref_segunda_mano?: number; tarifa_hora_basica: number; tarifa_hora_media: number; tarifa_hora_compleja: number; horas_estimadas: number; costo_piezas: number; subtotal_mano_obra: number; subtotal: number; iva_porcentaje: number; iva_importe: number; total: number; alertas: string[]; aprobado_por_cliente?: boolean; fecha_aprobacion?: string; observaciones_cliente?: string; }
export interface Pieza { id: UUID; orden_id: UUID; referencia?: string; descripcion: string; proveedor?: string; cantidad: number; costo_unitario: number; estado: "solicitada"|"recibida"|"instalada"|"devuelta"; }
export interface Progreso { id: UUID; orden_id: UUID; fecha: string; tipo: "diagnostico"|"reparacion"|"prueba"|"pausa"|"nota"; detalle: string; horas_invertidas?: number; adjuntos?: string[]; }
export interface ComponenteReemplazado { id: UUID; orden_id: UUID; ubicacion: string; componente: string; valor?: string; motivo_cambio?: string; prueba_funcional?: string; }
export interface Factura { id: UUID; orden_id: UUID; numero_factura: string; fecha_emision: string; base_imponible: number; iva_porcentaje: number; iva_importe: number; total: number; forma_pago: "efectivo"|"tarjeta"|"transferencia"|"otros"; pdf_url?: string; }
export interface Pago { id: UUID; factura_id: UUID; fecha: string; importe: number; metodo: string; referencia?: string; }
export interface Ajustes { id: number; moneda: string; iva_por_defecto: number; tarifas: { basica: number; media: number; compleja: number; }; nombre_taller: string; nif?: string; direccion?: string; telefono?: string; email?: string; pie_factura?: string; }
'@ | Set-Content -Encoding UTF8 packages/core/src/tipos/index.ts

@'
import { Dificultad } from "../tipos";
const round2 = (n:number)=>Math.round(n*100)/100;
export function calcularPresupuesto(params: {
  dificultad: Dificultad; horasEstimadas: number; costoPiezas: number;
  tarifas: { basica:number; media:number; compleja:number }; ivaPorcentaje: number;
  precioRefNuevo: number; precioRefSegundaMano?: number;
}) {
  const tarifa = params.tarifas[params.dificultad];
  const subtotalManoObra = round2(params.horasEstimadas * tarifa);
  const subtotal = round2(subtotalManoObra + params.costoPiezas);
  const ivaImporte = round2(subtotal * (params.ivaPorcentaje/100));
  const total = round2(subtotal + ivaImporte);
  const alertas:string[] = [];
  if (subtotal >= 0.7 * params.precioRefNuevo) alertas.push("supera_70_por_ciento_nuevo");
  if (params.precioRefSegundaMano && subtotal > params.precioRefSegundaMano) alertas.push("supera_precio_segunda_mano");
  if (subtotal > params.precioRefNuevo) alertas.push("no_viable_vs_nuevo");
  return { subtotalManoObra, subtotal, ivaImporte, total, alertas };
}
'@ | Set-Content -Encoding UTF8 packages/core/src/calculos/presupuesto.ts

@'
export * from "./tipos";
export * from "./calculos/presupuesto";
'@ | Set-Content -Encoding UTF8 packages/core/src/index.ts

@'
{
  "name": "@core/data",
  "version": "0.1.0",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": { "build": "tsc -p tsconfig.json" },
  "dependencies": { "dexie": "4.0.8", "uuid": "9.0.1" },
  "devDependencies": { "typescript": "5.5.4" }
}
'@ | Set-Content -Encoding UTF8 packages/data/package.json

@'
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "outDir": "dist", "declaration": true },
  "include": ["src/**/*"]
}
'@ | Set-Content -Encoding UTF8 packages/data/tsconfig.json

@'
import Dexie, { Table } from "dexie";
import type { Ajustes, Cliente, CategoriaAparato, Aparato, Orden, Inspeccion, Presupuesto, Pieza, Progreso, ComponenteReemplazado, Factura, Pago } from "@core/domain";
export class GRDB extends Dexie {
  clientes!: Table<Cliente, string>;
  categorias_aparatos!: Table<CategoriaAparato, string>;
  aparatos!: Table<Aparato, string>;
  ordenes!: Table<Orden, string>;
  inspecciones!: Table<Inspeccion, string>;
  presupuestos!: Table<Presupuesto, string>;
  piezas!: Table<Pieza, string>;
  progresos!: Table<Progreso, string>;
  componentes_reemplazados!: Table<ComponenteReemplazado, string>;
  facturas!: Table<Factura, string>;
  pagos!: Table<Pago, string>;
  ajustes!: Table<Ajustes, number>;
  constructor() {
    super("gestor_reparaciones");
    this.version(1).stores({
      clientes: "id, nombre, telefono, email, fecha_alta",
      categorias_aparatos: "id, nombre, activo",
      aparatos: "id, cliente_id, categoria_id, marca, modelo, numero_serie",
      ordenes: "id, aparato_id, codigo_orden, estado, fecha_creacion",
      inspecciones: "id, orden_id",
      presupuestos: "id, orden_id",
      piezas: "id, orden_id, estado",
      progresos: "id, orden_id, fecha",
      componentes_reemplazados: "id, orden_id",
      facturas: "id, orden_id, numero_factura",
      pagos: "id, factura_id",
      ajustes: "id"
    });
  }
}
export const db = new GRDB();
'@ | Set-Content -Encoding UTF8 packages/data/src/db.ts

@'
import { db } from "../src/db";
import { v4 as uuid } from "uuid";
import type { Orden } from "@core/domain";
export async function crearOrden(base: Omit<Orden,"id"|"fecha_creacion"|"fecha_actualizacion">) {
  const id = uuid();
  const ahora = new Date().toISOString();
  const data: Orden = { id, fecha_creacion: ahora, fecha_actualizacion: ahora, ...base };
  await db.ordenes.add(data);
  return data;
}
export async function actualizarEstado(orden_id: string, estado: Orden["estado"]) {
  const ahora = new Date().toISOString();
  await db.ordenes.update(orden_id, { estado, fecha_actualizacion: ahora });
}
'@ | Set-Content -Encoding UTF8 packages/data/src/repos/ordenes.ts

@'
export * from "./db";
export * as OrdenesRepo from "./repos/ordenes";
'@ | Set-Content -Encoding UTF8 packages/data/src/index.ts

@'
{
  "name": "@app/web",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "deploy": "vite build && gh-pages -d dist"
  },
  "dependencies": {
    "@core/domain": "workspace:*",
    "@core/data": "workspace:*",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "react-hook-form": "7.53.0",
    "zod": "3.23.8",
    "zustand": "4.5.4",
    "dexie": "4.0.8",
    "lucide-react": "0.446.0",
    "i18next": "23.11.5"
  },
  "devDependencies": {
    "@types/react": "18.3.3",
    "@types/react-dom": "18.3.0",
    "@vitejs/plugin-react": "4.3.1",
    "autoprefixer": "10.4.20",
    "gh-pages": "6.2.0",
    "postcss": "8.4.41",
    "tailwindcss": "3.4.10",
    "typescript": "5.5.4",
    "vite": "5.4.2"
  }
}
'@ | Set-Content -Encoding UTF8 apps/web/package.json

@'
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "jsx": "react-jsx", "outDir": "dist-types" },
  "include": ["src","vite-env.d.ts"]
}
'@ | Set-Content -Encoding UTF8 apps/web/tsconfig.json

@'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({ plugins: [react()], base: "/gestor-reparaciones/" });
'@ | Set-Content -Encoding UTF8 apps/web/vite.config.ts

@'
export default { plugins: { tailwindcss: {}, autoprefixer: {} } };
'@ | Set-Content -Encoding UTF8 apps/web/postcss.config.js

@'
export default {
  content: ["./index.html","./src/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: []
};
'@ | Set-Content -Encoding UTF8 apps/web/tailwind.config.js

@'
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Gestor de Reparaciones</title>
  </head>
  <body class="min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
'@ | Set-Content -Encoding UTF8 apps/web/index.html

@'
/// <reference types="vite/client" />
'@ | Set-Content -Encoding UTF8 apps/web/vite-env.d.ts

@'
@tailwind base;
@tailwind components;
@tailwind utilities;
'@ | Set-Content -Encoding UTF8 apps/web/src/styles.css

@'
import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { App } from "./modules/app/App";
createRoot(document.getElementById("root")!).render(<App />);
'@ | Set-Content -Encoding UTF8 apps/web/src/main.tsx

@'
import { useState } from "react";
import { Registro } from "../registro/Registro";
import { Presupuesto } from "../presupuesto/Presupuesto";
import { DetalleOrden } from "../reparacion/DetalleOrden";
export function App(){
  const [vista, setVista] = useState<"registro"|"presupuesto"|"detalle">("registro");
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <header className="flex gap-2">
        <button className="px-3 py-1 border" onClick={()=>setVista("registro")}>Registro</button>
        <button className="px-3 py-1 border" onClick={()=>setVista("presupuesto")}>Presupuesto</button>
        <button className="px-3 py-1 border" onClick={()=>setVista("detalle")}>Reparación</button>
      </header>
      {vista==="registro" && <Registro/>}
      {vista==="presupuesto" && <Presupuesto/>}
      {vista==="detalle" && <DetalleOrden/>}
    </div>
  );
}
'@ | Set-Content -Encoding UTF8 apps/web/src/modules/app/App.tsx

@'
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuid } from "uuid";
import { db } from "@core/data";
import type { CategoriaAparato, Cliente, Aparato, Orden } from "@core/domain";

const esquema = z.object({
  nombre: z.string().min(2), telefono: z.string().min(6), email: z.string().email().optional(),
  categoria: z.string(), marca: z.string().min(1), modelo: z.string().min(1), numero_serie: z.string().optional(),
  descripcion_danio_inicial: z.string().min(3),
});
type FormData = z.infer<typeof esquema>;

const CATS = [
  "Móviles y smartphones","Ordenadores","Consolas de videojuegos","Televisores","Baterías de litio",
  "Seascooters","Máquinas a batería","Robots de piscina","Robots aspiradores","Placas electrónicas genéricas","Otros dispositivos electrónicos"
];

export function Registro(){
  const { register, handleSubmit, reset, formState:{errors} } = useForm<FormData>({ resolver: zodResolver(esquema) });

  const onSubmit = async (d:FormData)=>{
    const ahora = new Date().toISOString();
    const cliente: Cliente = { id: uuid(), nombre: d.nombre, telefono: d.telefono, email: d.email, fecha_alta: ahora };
    const cat: CategoriaAparato = { id: uuid(), nombre: d.categoria, es_personalizada: !CATS.includes(d.categoria), activo: true };
    const aparato: Aparato = {
      id: uuid(), cliente_id: cliente.id, categoria_id: cat.id, marca: d.marca, modelo: d.modelo,
      numero_serie: d.numero_serie, descripcion_danio_inicial: d.descripcion_danio_inicial, fecha_recepcion: ahora
    };
    const orden: Orden = {
      id: uuid(), aparato_id: aparato.id, codigo_orden: `ORD-${Date.now()}`, estado: "recepcion",
      fecha_creacion: ahora, fecha_actualizacion: ahora
    };
    await db.transaction("rw", db.clientes, db.categorias_aparatos, db.aparatos, db.ordenes, async ()=>{
      await db.clientes.add(cliente);
      await db.categorias_aparatos.add(cat);
      await db.aparatos.add(aparato);
      await db.ordenes.add(orden);
    });
    reset();
    [alert]("Orden creada: "+orden.codigo_orden);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-2">
      <h2 className="text-xl font-semibold">Registro Cliente y Aparato</h2>
      <input placeholder="Nombre*" {...register("nombre")} className="border p-2"/>
      <input placeholder="Teléfono*" {...register("telefono")} className="border p-2"/>
      <input placeholder="Email" {...register("email")} className="border p-2"/>
      <select {...register("categoria")} className="border p-2">
        {CATS.map(c=> <option key={c} value={c}>{c}</option>)}
        <option value="Personalizada">Añadir personalizada…</option>
      </select>
      <input placeholder="Marca*" {...register("marca")} className="border p-2"/>
      <input placeholder="Modelo*" {...register("modelo")} className="border p-2"/>
      <input placeholder="Nº de serie" {...register("numero_serie")} className="border p-2"/>
      <textarea placeholder="Daño inicial*" {...register("descripcion_danio_inicial")} className="border p-2"/>
      {Object.values(errors).length>0 && <p className="text-red-600">Revisa los campos obligatorios.</p>}
      <button className="bg-black text-white p-2">Crear orden</button>
    </form>
  );
}
'@ | Set-Content -Encoding UTF8 apps/web/src/modules/registro/Registro.tsx

@'
import { useState } from "react";
import { calcularPresupuesto, Dificultad } from "@core/domain";
export function Presupuesto(){
  const [dificultad, setDificultad] = useState<Dificultad>("basica");
  const [horas, setHoras] = useState(1);
  const [costoPiezas, setCostoPiezas] = useState(0);
  const [nuevo, setNuevo] = useState(100);
  const [segunda, setSegunda] = useState<number|undefined>(undefined);
  const [iva, setIva] = useState(21);
  const [tarifas] = useState({ basica:25, media:35, compleja:50 });
  const r = calcularPresupuesto({ dificultad, horasEstimadas: horas, costoPiezas, tarifas, ivaPorcentaje: iva, precioRefNuevo: nuevo, precioRefSegundaMano: segunda });
  return (
    <div className="grid gap-2">
      <h2 className="text-xl font-semibold">Presupuesto inicial</h2>
      <div className="grid grid-cols-2 gap-2">
        <label> Dificultad
          <select className="border p-2" value={dificultad} onChange={e=>setDificultad(e.target.value as any)}>
            <option value="basica">Básica</option><option value="media">Media</option><option value="compleja">Compleja</option>
          </select>
        </label>
        <label> Horas estimadas
          <input type="number" className="border p-2" value={horas} onChange={e=>setHoras(parseFloat(e.target.value))}/>
        </label>
        <label> Costo piezas
          <input type="number" className="border p-2" value={costoPiezas} onChange={e=>setCostoPiezas(parseFloat(e.target.value))}/>
        </label>
        <label> Precio ref. nuevo*
          <input type="number" className="border p-2" value={nuevo} onChange={e=>setNuevo(parseFloat(e.target.value))}/>
        </label>
        <label> Precio ref. 2ª mano
          <input type="number" className="border p-2" value={segunda ?? ""} onChange={e=>setSegunda(e.target.value ? parseFloat(e.target.value) : undefined)}/>
        </label>
        <label> IVA %
          <input type="number" className="border p-2" value={iva} onChange={e=>setIva(parseFloat(e.target.value))}/>
        </label>
      </div>
      <div className="border p-3">
        <p>Subtotal mano de obra: <b>{r.subtotalManoObra.toFixed(2)}</b></p>
        <p>Subtotal: <b>{r.subtotal.toFixed(2)}</b></p>
        <p>IVA: <b>{r.ivaImporte.toFixed(2)}</b></p>
        <p>Total: <b>{r.total.toFixed(2)}</b></p>
        {r.alertas.length>0 && (
          <ul className="mt-2">
            {r.alertas.includes("supera_70_por_ciento_nuevo") && <li className="text-amber-600">Alerta: supera el 70% del precio nuevo.</li>}
            {r.alertas.includes("supera_precio_segunda_mano") && <li className="text-orange-600">Sugerencia: supera el precio de 2ª mano.</li>}
            {r.alertas.includes("no_viable_vs_nuevo") && <li className="text-red-600">No viable: supera el precio del equipo nuevo.</li>}
          </ul>
        )}
      </div>
    </div>
  );
}
'@ | Set-Content -Encoding UTF8 apps/web/src/modules/presupuesto/Presupuesto.tsx

@'
export function DetalleOrden(){
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Seguimiento de reparación</h2>
      <p>Placeholder: timeline, piezas y componentes reemplazados se añadirán en iteraciones siguientes.</p>
    </div>
  );
}
'@ | Set-Content -Encoding UTF8 apps/web/src/modules/reparacion/DetalleOrden.tsx

@'
name: Deploy GH Pages
on:
  push:
    branches: [ main ]
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"
      - run: pnpm install
      - run: pnpm -r build
      - name: Deploy web
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: apps/web/dist
          publish_branch: gh-pages
'@ | Set-Content -Encoding UTF8 .github/workflows/deploy.yml

@'
import { CapacitorConfig } from "@capacitor/cli";
const config: CapacitorConfig = {
  appId: "com.taller.gestor",
  appName: "Gestor de Reparaciones",
  webDir: "../apps/web/dist",
  bundledWebRuntime: false
};
export default config;
'@ | Set-Content -Encoding UTF8 mobile/capacitor.config.ts
