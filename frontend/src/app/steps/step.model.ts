export type StepId =
  | 'upload'
  | 'columns-to-keep'
  | 'columns-to-split'
  | 'naming-download';

export interface WizardCtx {
  // Estado compartido entre pasos
  fileId?: string;
  headers?: string[];
  headersData?: any[];
  headersToKeep?: string[];
  headersToSplit?: string[];
  baseName?: string;
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
