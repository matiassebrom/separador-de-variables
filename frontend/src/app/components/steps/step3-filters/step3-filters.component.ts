import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
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
export class Step3FiltersComponent implements OnInit {
	@Input() isStepCurrent = false;
	@Input() canAccessStep = false;
	@Input() isStepCompleted = false;
	@Input() selectedFilterColumn = '';
	@Input() selectedFiltersMap: Record<string, boolean> = {};
	@Input() selectedFilters: string[] = [];
	@Input() etapaValues: string[] = [];
	@Input() headers: string[] = [];
	@Input() uniqueValues: string[] = [];
	@Input() selectedUniqueValues: string[] = [];
	@Input() columnValues: string[] = [];
	@Output() filterColumnChange = new EventEmitter<string>();
	@Output() filterCheckboxChange = new EventEmitter<{ value: string; checked: boolean }>();
	@Output() clearFilters = new EventEmitter<void>();
	@Output() nextStep = new EventEmitter<void>();
	@Output() uniqueValuesChange = new EventEmitter<string[]>();

	searchTerm = '';
	selectedUniqueValuesLocal: string[] = [];
	selectedColumnValues: string[] = [];
	headerSearchTerm: string = '';

	constructor(
		private api: ApiService,
		public fileStateService: FileStateService
	) {}

	ngOnInit() {
		// Inicializar el estado local con los valores recibidos (si los hay)
		this.selectedUniqueValuesLocal = [...this.selectedUniqueValues];
	}

	get filteredHeaders(): string[] {
		if (!this.headerSearchTerm) return this.headers;
		return (this.headers || []).filter(
			(h: string) => h && h.toLowerCase().includes(this.headerSearchTerm.toLowerCase())
		);
	}

	onFilterColumnChange(header: string) {
		this.filterColumnChange.emit(header);
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

	get filteredUniqueValues() {
		if (!this.searchTerm) return this.uniqueValues;
		return this.uniqueValues.filter((v) => v.toLowerCase().includes(this.searchTerm.toLowerCase()));
	}

	isValueSelected(value: string): boolean {
		return this.selectedUniqueValuesLocal.includes(value);
	}

	toggleValue(value: string) {
		if (this.isValueSelected(value)) {
			this.selectedUniqueValuesLocal = this.selectedUniqueValuesLocal.filter((v) => v !== value);
		} else {
			this.selectedUniqueValuesLocal = [...this.selectedUniqueValuesLocal, value];
		}
		this.uniqueValuesChange.emit(this.selectedUniqueValuesLocal);
		console.log(this.selectedUniqueValuesLocal);
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
		this.uniqueValuesChange.emit(this.selectedColumnValues);
	}
}
