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
  init(steps: StepDef[], initialCtx?: Partial<WizardCtx>): void {
    // Setear steps con required: true por defecto
    const normalizedSteps = steps.map(step => ({
      ...step,
      required: step.required ?? true
    }));
    
    this.steps.set(normalizedSteps);
    this.index.set(0);
    
    // Mergear contexto inicial si se provee
    if (initialCtx) {
      this.ctx.update(current => ({ ...current, ...initialCtx }));
    }
  }

  // ---- Mutadores de contexto (patch helpers) ----
  patchCtx(patch: Partial<WizardCtx>): void {
    this.ctx.update(current => ({ ...current, ...patch }));
  }

  updateFilter(col: string, values: string[]): void {
    this.ctx.update(current => ({
      ...current,
      filters: {
        ...current.filters,
        [col]: values
      }
    }));
  }

  cacheUniques(col: string, uniques: string[]): void {
    this.ctx.update(current => ({
      ...current,
      uniquesCache: {
        ...current.uniquesCache,
        [col]: uniques
      }
    }));
  }

  // ---- Navegación ----
  next(): void {
    // Si canNext() es false, no avanzar
    if (!this.canNext()) {
      return;
    }

    const currentStep = this.current();
    if (!currentStep) {
      return;
    }

    const currentCtx = this.ctx();

    // Ejecutar onSubmit del paso actual si existe
    currentStep.onSubmit?.(currentCtx);

    // Ejecutar onExit del paso actual si existe
    currentStep.onExit?.(currentCtx);

    // Avanzar index si no es el último paso
    const currentIndex = this.index();
    const totalSteps = this.steps().length;
    
    if (currentIndex < totalSteps - 1) {
      this.index.set(currentIndex + 1);
    }
  }

  back(): void {
    // Retroceder index si index > 0
    const currentIndex = this.index();
    if (currentIndex > 0) {
      this.index.set(currentIndex - 1);
    }
  }
}
