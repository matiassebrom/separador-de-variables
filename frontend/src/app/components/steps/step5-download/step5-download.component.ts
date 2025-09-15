import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FileStateService } from '../../../services/file-state.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
	selector: 'app-step5-download',
	templateUrl: './step5-download.component.html',
	styleUrls: ['./step5-download.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatCardModule,
		MatIconModule,
		MatButtonModule,
		MatExpansionModule
	]
})
export class Step5DownloadComponent {
	@Input() isStepCurrent: boolean = false;
	@Input() canAccessStep: boolean = false;
	@Input() isStepCompleted: boolean = false;
	@Output() nextStep = new EventEmitter<void>();

	// Simulación: previewFiles y lógica de exclusión. En producción, esto debe venir del FileStateService o ApiService.
	previewFiles = [
		{ name: 'Archivo 1', excluded: false },
		{ name: 'Archivo 2', excluded: false },
		{ name: 'Archivo 3', excluded: false }
	];

	get includedPreviewFiles() {
		return this.previewFiles.filter((f) => !f.excluded);
	}

	toggleFileExclusion(index: number) {
		if (typeof index === 'number' && this.previewFiles[index]) {
			this.previewFiles[index].excluded = !this.previewFiles[index].excluded;
		}
	}

	constructor(public fileState: FileStateService) {}

	get baseName() {
		return this.fileState.baseName();
	}

	set baseName(val: string) {
		this.fileState.setBaseName(val);
	}

	onDownload() {}
}
