import { Injectable, signal, computed } from '@angular/core';

export interface UploadedFileInfo {
	file_id: string;
	filename: string;
	message: string;
}

@Injectable({
	providedIn: 'root',
})
export class FileStateService {
	// 🎯 Signal que guarda la información del archivo
	private uploadedFile = signal<UploadedFileInfo | null>(null);

	// 📖 Computed signals para acceder a la información
	fileId = computed(() => this.uploadedFile()?.file_id ?? null);
	filename = computed(() => this.uploadedFile()?.filename ?? null);
	hasFile = computed(() => this.uploadedFile() !== null);

	// 💾 Método para guardar la respuesta del upload
	setUploadedFile(fileInfo: UploadedFileInfo) {
		this.uploadedFile.set(fileInfo);
		console.log('📁 Archivo guardado:', fileInfo);
	}

	// 🗑️ Método para limpiar el estado
	clearFile() {
		this.uploadedFile.set(null);
	}

	// 📋 Método para obtener el file_id actual
	getCurrentFileId(): string | null {
		return this.fileId();
	}
}
