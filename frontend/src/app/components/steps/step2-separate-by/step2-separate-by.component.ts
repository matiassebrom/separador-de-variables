
import {
	Component,
	Input,
	Output,
	EventEmitter,
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
import { ApiService } from '../../../services/api.service';
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
	sortColumn: 'header' | 'total_count' | 'unique_count' | '' = '';
	sortDirection: 'asc' | 'desc' = 'desc';

	@Input() isStepCurrent = false;
	@Input() canAccessStep = false;
	@Input() isStepCompleted = false;

	@Output() nextStep = new EventEmitter<void>();

	isLoadingHeaders = signal(false);
	errorMessage = signal<string>('');
	uniqueValues = signal<string[]>([]);
	isSaving = signal(false);

	headerSearchTerm: string = '';
	selectedHeaders: string[] = [];

	ngOnChanges(changes: SimpleChanges): void {}

	get headers() {
		return this.fileStateService.headersData();
	}

	constructor(
		private apiService: ApiService,
		public fileStateService: FileStateService
	) {}

	onSort(column: 'header' | 'total_count' | 'unique_count') {
		if (this.sortColumn === column) {
			this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			this.sortColumn = column;
			this.sortDirection = 'desc';
		}
	}

	hasSelectedHeaders(): boolean {
		return this.selectedHeaders.length > 0;
	}

	getSelectedHeadersCount(): number {
		return this.selectedHeaders.length;
	}

	getSelectedHeaderNames(): string[] {
		return this.selectedHeaders;
	}

	toggleHeader(header: string) {
		const idx = this.selectedHeaders.indexOf(header);
		if (idx > -1) {
			this.selectedHeaders.splice(idx, 1);
		} else {
			this.selectedHeaders.push(header);
		}
	}

	onContinueClick() {
		const fileId = this.fileStateService.fileId();
		const headers = [...this.selectedHeaders];
		if (!fileId || headers.length === 0) {
			this.errorMessage.set('Selecciona al menos una columna a mantener');
			return;
		}
		this.isSaving.set(true);
		this.apiService.setHeadersToKeep(fileId, headers).subscribe({
			next: () => {
				this.fileStateService.setHeadersToKeep(headers);
				this.isSaving.set(false);
				this.nextStep.emit();
			},
			error: (error) => {
				this.isSaving.set(false);
				this.errorMessage.set('Error al guardar columnas a mantener');
				console.error('Error al hacer setHeadersToKeep:', error);
			}
		});
	}

	get filteredHeaders() {
		let filtered = this.headers;
		if (this.headerSearchTerm) {
			filtered = filtered.filter(h => h.header.toLowerCase().includes(this.headerSearchTerm.toLowerCase()));
		}
		if (this.sortColumn) {
			filtered = [...filtered].sort((a, b) => {
				if (this.sortColumn === 'header') {
					return this.sortDirection === 'desc'
						? b.header.localeCompare(a.header)
						: a.header.localeCompare(b.header);
				}
				if (this.sortColumn === 'total_count') {
					return this.sortDirection === 'desc'
						? b.total_count - a.total_count
						: a.total_count - b.total_count;
				}
				if (this.sortColumn === 'unique_count') {
					return this.sortDirection === 'desc'
						? b.unique_count - a.unique_count
						: a.unique_count - b.unique_count;
				}
				return 0;
			});
		}
		return filtered;
	}
}