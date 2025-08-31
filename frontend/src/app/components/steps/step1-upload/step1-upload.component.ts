import { Component, Input, Output, EventEmitter } from '@angular/core';
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

	onFileUpload() {
		this.fileUpload.emit();
	}
}
