import {
	Component,
	Input,
	Output,
	EventEmitter,
	OnInit,
	OnChanges,
	SimpleChanges,
	signal,
	effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiService, UniqueValuesResponse } from '../../../services/api.service';
import { FileStateService } from '../../../services/file-state.service';

@Component({
	selector: 'app-step2-separate-by',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		MatExpansionModule,
		MatFormFieldModule,
		MatSelectModule,
		MatButtonModule,
		MatIconModule
	],
	templateUrl: './step2-separate-by.component.html',
	styleUrl: './step2-separate-by.component.scss'
})
export class Step2SeparateByComponent implements OnChanges {
	@Input() isStepCurrent = false;
	@Input() canAccessStep = false;
	@Input() isStepCompleted = false;

	@Output() nextStep = new EventEmitter<void>();
	selectedSeparateBy = '';

	// 🎯 Signals para estado reactivo
	headers = signal<string[]>([]);
	isLoadingHeaders = signal(false);
	errorMessage = signal<string>('');
	uniqueValues = signal<string[]>([]);
	isSaving = signal(false);

	constructor(
		private apiService: ApiService,
		public fileStateService: FileStateService
	) {
		// 🎯 Effect que reacciona a cambios en el file_id
		effect(() => {
			const fileId = this.fileStateService.fileId();
			const canAccess = this.canAccessStep;
			const isCurrentStep = this.isStepCurrent;

			// Solo cargar headers si:
			// 1. Hay un file_id disponible
			// 2. El paso está habilitado para acceso
			// 3. Es el paso actual (está expandido)
			if (fileId && canAccess && isCurrentStep) {
				console.log('🔄 Effect: Cargando headers para file_id:', fileId);
				this.loadHeaders();
			}
		});
	}

	ngOnChanges(changes: SimpleChanges) {
		// Detectar cuando el paso se vuelve accesible o actual
		if (changes['canAccessStep'] || changes['isStepCurrent']) {
			const fileId = this.fileStateService.fileId();

			if (fileId && this.canAccessStep && this.isStepCurrent) {
				console.log('🔄 ngOnChanges: Paso activado, cargando headers para:', fileId);
				this.loadHeaders();
			}
		}
	}

	loadHeaders() {
		const fileId = this.fileStateService.fileId();
		if (!fileId) {
			this.errorMessage.set('No hay archivo subido');
			return;
		}

		// Evitar cargas duplicadas
		if (this.isLoadingHeaders() || this.headers().length > 0) {
			console.log('⚠️ Headers ya cargados o en proceso de carga');
			return;
		}

		this.isLoadingHeaders.set(true);
		this.errorMessage.set('');
		console.log('📡 Enviando petición GET /get_headers/' + fileId);

		this.apiService.getHeaders(fileId).subscribe({
			next: (response) => {
				this.headers.set(response.headers);
				this.isLoadingHeaders.set(false);
				console.log('✅ Headers cargados exitosamente:', response.headers);
			},
			error: (error) => {
				console.error('❌ Error al cargar headers:', error);
				this.errorMessage.set('Error al cargar las columnas del archivo');
				this.isLoadingHeaders.set(false);
			}
		});
	}

	onSeparateByChange(value: string) {
		this.selectedSeparateBy = value;
	}

	onContinueClick() {
		const fileId = this.fileStateService.fileId();
		const header = this.selectedSeparateBy;
		if (!fileId || !header) {
			this.errorMessage.set('Selecciona una columna para separar');
			return;
		}
		this.isSaving.set(true);
		this.apiService.setHeaderToSplit(fileId, header).subscribe({
			next: (response: UniqueValuesResponse) => {
				this.uniqueValues.set(response.unique_values_in_header_to_split);
				this.isSaving.set(false);
				this.nextStep.emit();
			},
			error: (error) => {
				this.isSaving.set(false);
				this.errorMessage.set('Error al guardar el header de separación');
				console.error('Error al hacer set_header_to_split:', error);
			}
		});
	}
}
