import { Component, Input, Output, EventEmitter, signal, effect, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '../../../services/api.service';
import { FileStateService } from '../../../services/file-state.service';

@Component({
	selector: 'app-step4-choose-columns',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		MatExpansionModule,
		MatCheckboxModule,
		MatButtonModule,
		MatIconModule,
		MatFormFieldModule,
		MatSelectModule,
		MatOptionModule,
		MatChipsModule
	],
	templateUrl: './step4-choose-columns.component.html',
	styleUrl: './step4-choose-columns.component.scss'
})
export class Step4ChooseColumnsComponent implements OnChanges {
	ngOnChanges(changes: SimpleChanges) {
		if (changes['canAccessStep'] || changes['isStepCurrent']) {
			const fileId = this.fileStateService.fileId();
			if (fileId && this.canAccessStep && this.isStepCurrent) {
				this.loadHeaders();
			}
		}
	}
	@Input() isStepCurrent = false;
	@Input() canAccessStep = false;
	@Input() isStepCompleted = false;
	@Output() nextStep = new EventEmitter<void>();

	selectedColumn: string = '';
	selectedColumns: string[] = [];

	isLoadingHeaders = signal(false);
	headers = signal<string[]>([]);
	headerSearchTerm: string = '';
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

	onColumnChange(header: string) {
		this.selectedColumn = header;
		if (header && !this.selectedColumns.includes(header)) {
			this.selectedColumns = [...this.selectedColumns, header];
		}
	}

	removeColumn(header: string) {
		this.selectedColumns = this.selectedColumns.filter((col) => col !== header);
		if (this.selectedColumn === header) {
			this.selectedColumn = '';
		}
	}

	onContinue() {
		this.nextStep.emit();
	}
}
