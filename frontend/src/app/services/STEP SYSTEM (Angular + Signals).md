STEP SYSTEM (Angular + Signals) — Servicios

Objetivo: crear un sistema reusable de pasos (wizard lineal) basado en señales de Angular v16+.
En esta etapa solo generamos servicios y modelos. Los componentes se conectarán después.

📦 Archivos a crear

src/app/steps/step.model.ts

src/app/steps/step.store.ts

src/app/steps/steps.config.ts (de ejemplo para esta app de Excel; sirve como plantilla)

Nota: no crear componentes ahora. El store debe quedar listo para ser inyectado y usado desde cualquier componente luego.

1. step.model.ts — Modelos y contratos

Crear los tipos base del sistema:

// src/app/steps/step.model.ts

export type StepId =
| 'upload'
| 'headers'
| 'separate'
| 'filters'
| 'keep'
| 'naming'
| 'generate';

export interface WizardCtx {
// Estado compartido entre pasos (ejemplo actual de la app Excel)
df?: unknown; // dataset/tabla cargada
columns?: string[];
separateBy?: string;
filters?: Record<string, string[]>; // col -> valores permitidos
keepCols?: string[];
baseName?: string;

// Caches y derivados
uniquesCache?: Record<string, string[]>; // col -> valores únicos cacheados
}

export interface StepDef {
id: StepId;
title: string;
required?: boolean; // default: true

// Reglas de validación para habilitar "Continuar"
validate: (ctx: WizardCtx) => boolean;

// Hooks opcionales
onEnter?: (ctx: WizardCtx) => void | Promise<void>;
onExit?: (ctx: WizardCtx) => void | Promise<void>;
onSubmit?: (ctx: WizardCtx) => void | Promise<void>;
}

Requisitos:

Tipos estrictos.

required por defecto en true si no se especifica.

Comentarios breves por cada campo.

2. step.store.ts — Store con señales

Servicio inyectable que orquesta el flujo y expone señales para la UI.

API esperada
// src/app/steps/step.store.ts
import { Injectable, signal, computed, effect } from '@angular/core';
import { StepDef, WizardCtx } from './step.model';

@Injectable({ providedIn: 'root' })
export class StepStore {
// ---- Source of truth ----
readonly ctx = signal<WizardCtx>({
filters: {},
uniquesCache: {}
});

readonly steps = signal<StepDef[]>([]);
readonly index = signal(0);

// ---- Derivadas ----
readonly current = computed(() => this.steps()[this.index()]);
readonly canNext = computed(() => {
const s = this.current();
return !!s && s.validate(this.ctx());
});

// Para pintar progreso en la UI lateral
readonly progress = computed(() => {
const i = this.index();
return this.steps().map((s, idx) => ({
id: s.id,
title: s.title,
state: idx < i ? 'done' : idx === i ? 'current' : 'locked'
}));
});

constructor() {
// Efecto: al cambiar de paso, ejecutar onEnter (idempotente)
effect(() => {
const s = this.current();
s?.onEnter?.(this.ctx());
}, { allowSignalWrites: true });
}

// ---- Inicialización ----
init(steps: StepDef[], initialCtx?: Partial<WizardCtx>): void;

// ---- Mutadores de contexto (patch helpers) ----
patchCtx(patch: Partial<WizardCtx>): void;
updateFilter(col: string, values: string[]): void;
cacheUniques(col: string, uniques: string[]): void;

// ---- Navegación ----
next(): void; // valida, onSubmit, onExit, avanza +1
back(): void; // retrocede -1 (sin romper precondiciones)
}

Reglas de implementación

init(steps, initialCtx):

Setear steps con required: true por defecto (merge).

Poner index = 0.

Hacer ctx.update con initialCtx si se provee.

next():

Si canNext() es false, no avanzar.

Ejecutar onSubmit(ctx) del paso actual si existe.

Ejecutar onExit(ctx) del paso actual si existe.

Avanzar index si no es el último paso.

back():

Retroceder index si index > 0.

Idempotencia: hooks deben tolerar rerenders sin duplicar trabajos.

Nada de RxJS: solo signal/computed/effect.

3. steps.config.ts — Configuración de pasos (demo Excel)

Archivo de ejemplo para esta app (sirve de referencia de cómo definir pasos).
No debe forzar dependencias a componentes.

// src/app/steps/steps.config.ts
import { StepDef } from './step.model';

export const STEPS: StepDef[] = [
{
id: 'upload',
title: '1) Subir archivo',
validate: (ctx) => !!ctx.df
},
{
id: 'headers',
title: '2) Cabeceras',
validate: (ctx) => (ctx.columns?.length ?? 0) > 0
},
{
id: 'separate',
title: '3) Separar por',
validate: (ctx) => !!ctx.separateBy
},
{
id: 'filters',
title: '4) Filtros (opcional)',
required: false,
validate: () => true
},
{
id: 'keep',
title: '5) Datos a guardar',
validate: (ctx) => (ctx.keepCols?.length ?? 0) > 0
},
{
id: 'naming',
title: '6) Nombre base',
validate: (ctx) => !!ctx.baseName && ctx.baseName.trim().length > 0
},
{
id: 'generate',
title: '7) Generar archivos',
validate: () => true
}
];

🧪 Cómo se usa (desde componentes, más adelante)

Ahora NO crear componentes, pero dejá claro el patrón de uso:

Inyectar StepStore en un “shell” del wizard y llamar:

store.init(STEPS, { filters: {}, uniquesCache: {} });

Pintar progreso con store.progress().

Mostrar el paso actual con store.current().

Habilitar “Continuar” con store.canNext().

Acciones de UI llaman a store.patchCtx(...), store.updateFilter(...), store.cacheUniques(...).

Navegación con store.next() y store.back().

✅ Criterios de aceptación

Los tres archivos se crean con los nombres y rutas exactas.

StepStore compila y expone todas las APIs declaradas.

No usa RxJS; solo signal/computed/effect.

No hay referencia a componentes ni a Angular Material en estos servicios.

Código tipado, con comentarios breves y claros.

steps.config.ts es auto‑contenible y no acopla UI.

📎 Notas de calidad

Los hooks (onEnter, onExit, onSubmit) deben ser opcionales e idempotentes.

validate nunca debe mutar estado: solo leer ctx.

patchCtx debe hacer inmutabilidad superficial ({ ...old, ...patch }).

updateFilter y cacheUniques deben mergear preservando claves previas.

✍️ Tareas para Copilot

Crea e implementa los archivos arriba listados, respetando exactamente las firmas y reglas.
No generes componentes ahora. Centrate en modelos + store con señales.
