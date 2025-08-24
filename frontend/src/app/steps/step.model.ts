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
  df?: unknown;                         // dataset/tabla cargada
  columns?: string[];
  separateBy?: string;
  filters?: Record<string, string[]>;   // col -> valores permitidos
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
  onExit?:  (ctx: WizardCtx) => void | Promise<void>;
  onSubmit?: (ctx: WizardCtx) => void | Promise<void>;
}
