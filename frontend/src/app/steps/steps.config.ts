import { StepDef } from './step.model';

export const STEPS: StepDef[] = [
	{
		id: 'upload',
		title: '1) Subir archivo',
		validate: (ctx) => !!ctx.df,
	},
	{
		id: 'separate',
		title: '2) Elegir "Separar por"',
		validate: (ctx) => (ctx.columns?.length ?? 0) > 0,
	},
	{
		id: 'filters',
		title: '3) Filtros (opcional)',
		required: false,
		validate: () => true,
	},
	{
		id: 'keep',
		title: '4) Datos a guardar',
		validate: (ctx) => (ctx.keepCols?.length ?? 0) > 0,
	},
	{
		id: 'naming',
		title: '5) Nombre base',
		validate: (ctx) => !!ctx.baseName && ctx.baseName.trim().length > 0,
	},
	{
		id: 'generate',
		title: '6) Generar archivos',
		validate: () => true,
	},
];
