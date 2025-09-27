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
import { ApiService,  } from '../../../services/api.service';
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
	isLoadingHeaders = signal(false);
	errorMessage = signal<string>('');
	uniqueValues = signal<string[]>([]);
	isSaving = signal(false);

	// Buscador de headers
	headerSearchTerm: string = '';
	// Getter para filtrar headers según el término de búsqueda
	get filteredHeaders(): string[] {
		const headers = this.fileStateService.headers();
		if (!this.headerSearchTerm) return headers;
		return (headers || []).filter((h: string) => h && h.toLowerCase().includes(this.headerSearchTerm.toLowerCase()));
	}

	constructor(
		private apiService: ApiService,
		public fileStateService: FileStateService
	) {}

	ngOnChanges(changes: SimpleChanges) {
		// Ya no es necesario cargar headers aquí, se obtienen del FileStateService
	}

	onSeparateByChange(value: string) {
		this.selectedSeparateBy = value;
	}

/* 	onContinueClick() {
		const fileId = this.fileStateService.fileId();
		const header = this.selectedSeparateBy;
		if (!fileId || !header) {
			this.errorMessage.set('Selecciona una columna para separar');
			return;
		}
		this.isSaving.set(true);
		this.apiService.setHeaderToSplitAndGetValues(fileId, header).subscribe({
			next: (uniqueValues: string[]) => {
				console.log('✅ Valores únicos recibidos:', uniqueValues);
				this.uniqueValues.set(uniqueValues);
				this.isSaving.set(false);
				this.nextStep.emit();
			},
			error: (error) => {
				this.isSaving.set(false);
				this.errorMessage.set('Error al guardar el header de separación');
				console.error('Error al hacer set_header_to_split:', error);
			}
		});
	} */
}
