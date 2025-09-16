import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FileStateService } from '../../../services/file-state.service';
import { ApiService } from '../../../services/api.service';
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

	constructor(
		public fileState: FileStateService,
		private api: ApiService
	) {}

	get baseName() {
		return this.fileState.baseName();
	}

	set baseName(val: string) {
		this.fileState.setBaseName(val);
	}

	onDownload() {
		const fileId = this.fileState.fileId();
		const baseName = this.baseName;
		if (!fileId || !baseName) return;

		// 1. POST para setear el nombre base
		this.api.setBaseName(fileId, baseName).subscribe({
			next: () => {
				// 2. GET para descargar el archivo
				this.api.downloadFiles(fileId).subscribe({
					next: (blob) => {
						// Descargar el archivo zip
						const url = window.URL.createObjectURL(blob);
						const a = document.createElement('a');
						a.href = url;
						a.download = `${baseName}.zip`;
						document.body.appendChild(a);
						a.click();
						document.body.removeChild(a);
						window.URL.revokeObjectURL(url);
					},
					error: (err) => {
						alert('Error al descargar el archivo');
					}
				});
			},
			error: (err) => {
				alert('Error al guardar el nombre base');
			}
		});
	}
}
