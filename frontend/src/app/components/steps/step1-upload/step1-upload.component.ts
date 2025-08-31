import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'app-step1-upload',
	standalone: true,
	imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
	templateUrl: './step1-upload.component.html',
	styleUrl: './step1-upload.component.scss',
})
export class Step1UploadComponent {
	@Input() fileUploaded = false;
	@Output() fileUpload = new EventEmitter<void>();

	selectedFile: File | null = null;

	constructor(private api: ApiService) {}

	onFileSelected(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			this.selectedFile = input.files[0];
		} else {
			this.selectedFile = null;
		}
	}

	onFileUpload() {
		if (!this.selectedFile) {
			console.warn('No file selected');
			return;
		}
		const formData = new FormData();
		formData.append('file', this.selectedFile);
		this.api.uploadExcel(formData).subscribe({
			next: (resp: any) => {
				console.log('Respuesta backend:', resp);
				this.fileUpload.emit();
			},
			error: (err: any) => {
				console.error('Error backend:', err);
			},
		});
	}
}
