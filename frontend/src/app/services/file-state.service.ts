import { Injectable, signal, computed } from '@angular/core';
import { HeaderDataItem } from '../interfaces/header-data-item.interface';
import { UploadedFileInfo } from '../interfaces/UploadedFileInfo.interface';


@Injectable({
	providedIn: 'root'
})
export class FileStateService {
	// 🎯 Signal que guarda la información del archivo
	private uploadedFile = signal<UploadedFileInfo | null>(null);

	// 🎯 Signal para los headers del archivo
	private _headers = signal<string[]>([]);
	headers = computed(() => this._headers());

	// 📖 Computed signals para acceder a la información
	fileId = computed(() => this.uploadedFile()?.file_id ?? null);
	filename = computed(() => this.uploadedFile()?.filename ?? null);
	hasFile = computed(() => this.uploadedFile() !== null);

	// 💾 Método para guardar la respuesta del upload
	setUploadedFile(fileInfo: UploadedFileInfo) {
		this.uploadedFile.set(fileInfo);
		// Quitar la extensión si existe
		const nameWithoutExt = fileInfo.filename.replace(/\.[^/.]+$/, '');
		this.setBaseName(nameWithoutExt);
		console.log('📁 Archivo guardado:', fileInfo);
	}

	// Método para guardar los headers
	setHeaders(headers: string[]) {
		this._headers.set(headers);
		console.log('📋 Headers guardados:', headers);
	}

	// 🗑️ Método para limpiar el estado
	clearFile() {
		this.uploadedFile.set(null);
		this._headers.set([]);
	}

	// 📋 Método para obtener el file_id actual
	getCurrentFileId(): string | null {
		return this.fileId();
	}

	// Signal para el nombre base de los archivos
	private _baseName = signal<string>('');
	baseName = computed(() => this._baseName());

	setBaseName(name: string) {
		this._baseName.set(name);
	}

	getBaseName(): string {
		return this._baseName();
	}

	    // Método para guardar los datos completos de los headers
    private _headersData = signal<HeaderDataItem[]>([]);
    headersData = computed(() => this._headersData());

    setHeadersData(headersData: HeaderDataItem[]) {
        this._headersData.set(headersData);
        console.log('📋 HeadersData guardados:', headersData);
    }
}

