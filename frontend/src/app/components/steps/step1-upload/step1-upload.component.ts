import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { ApiService } from '../../../services/api.service';
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

	constructor(private api: ApiService) {}

	onFileSelected(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			this.selectedFile.set(input.files[0]);
		} else {
			this.selectedFile.set(null);
		}
	}

	onFileDrop(event: DragEvent) {
		event.preventDefault();
		this.isDragOver.set(false);
		if (event.dataTransfer && event.dataTransfer.files.length > 0) {
			this.selectedFile.set(event.dataTransfer.files[0]);
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
			return;
		}

		this.isUploading.set(true); // 🚀 Activar loading

		const formData = new FormData();
		formData.append('file', file);

		this.api.uploadExcel(formData).subscribe({
			next: (resp: any) => {
				console.log('Respuesta backend:', resp);
				this.isUploading.set(false); // ✅ Desactivar loading
				this.fileUpload.emit();
			},
			error: (err: any) => {
				console.error('Error backend:', err);
				this.isUploading.set(false); // ❌ Desactivar loading en error
			},
		});
	}
}
