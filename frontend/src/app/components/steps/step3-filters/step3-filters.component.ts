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
import { ApiService } from '../../../services/api.service';
import { FileStateService } from '../../../services/file-state.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';

@Component({
	selector: 'app-step3-filters',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		MatExpansionModule,
		MatFormFieldModule,
		MatSelectModule,
		MatButtonModule,
		MatIconModule,
		MatCheckboxModule,
		MatChipsModule
	],
	templateUrl: './step3-filters.component.html',
	styleUrl: './step3-filters.component.scss'
})
export class Step3FiltersComponent implements OnInit, OnChanges {
	@Input() isStepCurrent = false;
	@Input() canAccessStep = false;
	@Input() isStepCompleted = false;

	@Output() nextStep = new EventEmitter<void>();

	columnValues: string[] = [];

	selectedFilterColumn: string = '';
	selectedColumnValues: string[] = [];

	headerSearchTerm: string = '';
	searchTerm = '';

	headers = signal<string[]>([]);
	isLoadingHeaders = signal(false);
	errorMessage = signal<string>('');

	constructor(
		private api: ApiService,
		public fileStateService: FileStateService
	) {
		// Efecto reactivo para cargar headers cuando el paso es accesible y actual
		effect(() => {
			const fileId = this.fileStateService.fileId();
			const canAccess = this.canAccessStep;
			const isCurrentStep = this.isStepCurrent;
			if (fileId && canAccess && isCurrentStep) {
				this.loadHeaders();
			}
		});
	}

	ngOnInit() {}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['canAccessStep'] || changes['isStepCurrent']) {
			const fileId = this.fileStateService.fileId();
			if (fileId && this.canAccessStep && this.isStepCurrent) {
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
		if (this.isLoadingHeaders() || this.headers().length > 0) {
			return;
		}
		this.isLoadingHeaders.set(true);
		this.errorMessage.set('');
		this.api.getHeaders(fileId).subscribe({
			next: (response) => {
				this.headers.set(response.headers);
				this.isLoadingHeaders.set(false);
			},
			error: (error) => {
				this.errorMessage.set('Error al cargar las columnas del archivo');
				this.isLoadingHeaders.set(false);
			}
		});
	}

	get filteredHeaders(): string[] {
		const headers = this.headers();
		if (!this.headerSearchTerm) return headers;
		return (headers || []).filter((h: string) => h && h.toLowerCase().includes(this.headerSearchTerm.toLowerCase()));
	}

	onFilterColumnChange(header: string) {
		this.selectedFilterColumn = header;
		const fileId = this.fileStateService.getCurrentFileId();
		// Llamar al backend solo si hay fileId y header seleccionado
		if (fileId && header) {
			this.api.setHeadersToKeep(fileId, [header]).subscribe({
				next: (resp) => {
					this.columnValues = resp.unique_values;
					console.log('Valores únicos recibidos:', resp.unique_values);
				},
				error: (err) => {
					console.error('Error setHeadersToKeep:', err);
				}
			});
		}
	}

	onContinue() {
		const fileId = this.fileStateService.getCurrentFileId();
		if (fileId && this.selectedFilterColumn && this.selectedColumnValues.length > 0) {
			this.api.setValuesToKeepByHeader(fileId, this.selectedFilterColumn, this.selectedColumnValues).subscribe({
				next: (resp) => {
					console.log('Valores enviados y guardados:', resp);
					this.nextStep.emit();
				},
				error: (err) => {
					console.error('Error setValuesToKeepByHeader:', err);
				}
			});
		} else {
			this.nextStep.emit();
		}
	}

	isColumnValueSelected(value: string): boolean {
		return this.selectedColumnValues.includes(value);
	}

	toggleColumnValue(value: string) {
		if (this.isColumnValueSelected(value)) {
			this.selectedColumnValues = this.selectedColumnValues.filter((v) => v !== value);
		} else {
			this.selectedColumnValues = [...this.selectedColumnValues, value];
			console.log('Valor de filtrado agregado:', value, this.selectedColumnValues);
		}
	}

	clearFilters() {
		this.selectedColumnValues = [];
	}
}
