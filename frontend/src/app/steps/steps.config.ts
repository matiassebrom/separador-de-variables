import { StepDef } from './step.model';


export const STEPS: StepDef[] = [
  {
    id: 'upload',
    title: '1) Subir archivo',
    validate: (ctx) => !!ctx.fileId,
  },
  {
    id: 'columns-to-keep',
    title: '2) Elegir columnas a mantener',
    validate: (ctx) => (ctx.headersToKeep?.length ?? 0) > 0,
  },
  {
    id: 'columns-to-split',
    title: '3) Elegir columnas para separar',
    validate: (ctx) => (ctx.headersToSplit?.length ?? 0) > 0,
  },
  {
    id: 'naming-download',
    title: '4) Configurar nombre y descargar',
    validate: (ctx) => !!ctx.baseName && ctx.baseName.trim().length > 0,
  },
];
