import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { ApiService} from '../../../services/api.service';


import { FileStateService } from '../../../services/file-state.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UploadFileResponse } from '../../../interfaces/upload-file-response.interface';
import { GetHeadersDataResponse } from '../../../interfaces/get-headers-data-response.interface';




@Component({
	selector: 'app-step1-upload',
	standalone: true,
	imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
	templateUrl: './step1-upload.component.html',
	styleUrl: './step1-upload.component.scss'
})
export class Step1UploadComponent {
	@Input() fileUploaded = false;
	@Output() fileUpload = new EventEmitter<void>();

	// 🎯 Signals para estado reactivo
	selectedFile = signal<File | null>(null);
	isDragOver = signal(false);
	isUploading = signal(false);
	uploadStatus = signal<string>('');

	constructor(
		private api: ApiService,
		public fileStateService: FileStateService
	) {}

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

		this.api.uploadFile(formData).subscribe({
			next: (response: UploadFileResponse) => {
				console.log('Respuesta backend:', response);
				this.isUploading.set(false); // ✅ Desactivar loading
				this.uploadStatus.set(`✓ ${response.message}`);

				// 💾 Guardar información del archivo en el estado global
				this.fileStateService.setUploadedFile({
					file_id: response.file_id,
					filename: response.filename,
					message: response.message
				});

				// 🚦 Pedir headers y guardarlos en el estado global
				this.api.getHeadersData(response.file_id).subscribe({
					next: (headersResp: GetHeadersDataResponse) => {
						// Guardar solo los nombres de los headers en el estado global
						const headers = headersResp.headers_data.map(h => h.header);
						this.fileStateService.setHeaders(headers);
						console.log('Headers guardados en FileStateService:', headers);
						this.fileUpload.emit();
					},
					error: (err) => {
						console.error('Error al obtener headers:', err);
						this.fileUpload.emit(); // Emitir igual para no bloquear el flujo
					}
				});
			},
			error: (err: any) => {
				console.error('Error backend:', err);
				this.isUploading.set(false); // ❌ Desactivar loading en error
				this.uploadStatus.set('❌ Error al subir el archivo');
			}
		});
	}
}
