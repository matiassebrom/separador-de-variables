import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { ApiService, UploadFileResponse } from '../../../services/api.service';
import { FileStateService } from '../../../services/file-state.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
	selector: 'app-step1-upload',
	standalone: true,
	imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
	templateUrl: './step1-upload.component.html',
	styleUrl: './step1-upload.component.scss',
})
export class Step1UploadComponent {
	@Input() fileUploaded = false;
	@Output() fileUpload = new EventEmitter<void>();

	// 🎯 Signals para estado reactivo
	selectedFile = signal<File | null>(null);
	isDragOver = signal(false);
	isUploading = signal(false);
	uploadStatus = signal<string>('');

	constructor(private api: ApiService, public fileStateService: FileStateService) {}

	onFileSelected(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			this.selectedFile.set(input.files[0]);
			this.uploadStatus.set('');
		} else {
			this.selectedFile.set(null);
		}
	}

	onFileDrop(event: DragEvent) {
		event.preventDefault();
		this.isDragOver.set(false);
		if (event.dataTransfer && event.dataTransfer.files.length > 0) {
			this.selectedFile.set(event.dataTransfer.files[0]);
			this.uploadStatus.set('');
		}
	}

	onDragOver(event: DragEvent) {
		event.preventDefault();
		this.isDragOver.set(true);
	}

	onDragLeave(event: DragEvent) {
		event.preventDefault();
		this.isDragOver.set(false);
	}

	onFileUpload() {
		const file = this.selectedFile();
		if (!file) {
			console.warn('No file selected');
			this.uploadStatus.set('❌ No hay archivo seleccionado');
			return;
		}

		this.isUploading.set(true); // 🚀 Activar loading
		this.uploadStatus.set('Subiendo archivo...');

		const formData = new FormData();
		formData.append('file', file);

		this.api.uploadExcel(formData).subscribe({
			next: (response: UploadFileResponse) => {
				console.log('Respuesta backend:', response);
				this.isUploading.set(false); // ✅ Desactivar loading
				this.uploadStatus.set(`✓ ${response.message}`);

				// 💾 Guardar información del archivo en el estado global
				this.fileStateService.setUploadedFile({
					file_id: response.file_id,
					filename: response.filename,
					message: response.message,
				});

				console.log('File ID guardado:', this.fileStateService.fileId());
				this.fileUpload.emit();
			},
			error: (err: any) => {
				console.error('Error backend:', err);
				this.isUploading.set(false); // ❌ Desactivar loading en error
				this.uploadStatus.set('❌ Error al subir el archivo');
			},
		});
	}
}
