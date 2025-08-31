import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';

// Importar los nuevos componentes
import { Step1UploadComponent } from './components/steps/step1-upload/step1-upload.component';
import { Step2SeparateByComponent } from './components/steps/step2-separate-by/step2-separate-by.component';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
		CommonModule,
		// RouterOutlet,
		MatButtonModule,
		MatExpansionModule,
		MatFormFieldModule,
		MatSelectModule,
		MatInputModule,
		MatCheckboxModule,
		MatCardModule,
		MatIconModule,
		MatChipsModule,
		FormsModule,
		// Nuevos componentes
		Step1UploadComponent,
		Step2SeparateByComponent,
	],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
	constructor(private api: ApiService) {}
	selectedFilterColumn: string = '';
	selectedFiltersMap: Record<string, boolean> = {};
	selectedColumnsMap: Record<string, boolean> = {};

	title = 'split-excel-frontend';
	currentStep = 1;
	fileUploaded = false;

	// <todo esto esta harcodeado para hacer pruebas

	selectedSeparateBy = 'ORIGEN';
	selectedColumns = ['ORIGEN', 'ETAPA', 'ID', 'TIPO'];
	baseName = 'datos_separados';
	headers = [
		'StartDate',
		'RecordedDate',
		'ResponseId',
		'ORIGEN',
		'Q_TerminateFlag',
		'ETAPA',
		'ID',
		'TIPO',
		'EDAD',
		'EDAD_COD',
		'FILTRO',
		'CUOTAFULL',
		'F11-EMPRESARIAL',
		'suma_eval',
	];
	etapaValues = ['Activos', 'Inactivos', 'Pendientes'];
	selectedFilters = ['Activos', 'Inactivos'];
	previewFiles = [
		{ name: 'datos_separados - ORIGEN - WEB.xlsx', excluded: false },
		{ name: 'datos_separados - ORIGEN - MOBILE.xlsx', excluded: false },
		{ name: 'datos_separados - ORIGEN - EMAIL.xlsx', excluded: true },
	];

	ngOnInit() {
		// Llamar al backend al iniciar la app
		this.api.pingBackend().subscribe({
			next: (resp) => console.log('Respuesta backend:', resp),
			error: (err) => console.error('Error backend:', err),
		});
	}

	onFilterCheckboxModelChange(value: string, checked: boolean) {
		if (checked) {
			if (!this.selectedFilters.includes(value)) {
				this.selectedFilters.push(value);
			}
		} else {
			const idx = this.selectedFilters.indexOf(value);
			if (idx > -1) {
				this.selectedFilters.splice(idx, 1);
			}
		}
	}

	onColumnCheckboxModelChange(header: string, checked: boolean) {
		if (checked) {
			if (!this.selectedColumns.includes(header)) {
				this.selectedColumns.push(header);
			}
		} else {
			const idx = this.selectedColumns.indexOf(header);
			if (idx > -1) {
				this.selectedColumns.splice(idx, 1);
			}
		}
	}

	get includedPreviewFiles() {
		return this.previewFiles.filter((f) => !f.excluded);
	}

	nextStep() {
		if (this.currentStep < 5) {
			this.currentStep++;
		}
	}
	isStepCompleted(step: number): boolean {
		return this.currentStep > step;
	}
	isStepCurrent(step: number): boolean {
		return this.currentStep === step;
	}
	canAccessStep(step: number): boolean {
		return step <= this.currentStep;
	}
	onFileUpload() {
		this.fileUploaded = true;
		this.nextStep();
	}
	
	onSeparateBySelected(value: string) {
		this.selectedSeparateBy = value;
	}
	
	toggleFileExclusion(index: number) {
		this.previewFiles[index].excluded = !this.previewFiles[index].excluded;
	}
}
