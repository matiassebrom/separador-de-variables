import { Injectable, signal, computed } from '@angular/core';
import { HeaderDataItem } from '../interfaces/header-data-item.interface';
import { UploadedFileInfo } from '../interfaces/uploadedFileInfo.interface';


@Injectable({
	providedIn: 'root'
})
export class FileStateService {
	// === Signals ===
	private uploadedFile = signal<UploadedFileInfo | null>(null);
	private _headers = signal<string[]>([]);
	private _headersData = signal<HeaderDataItem[]>([]);
	private _headersToKeep = signal<string[]>([]);
	private _headersToSplit = signal<string[]>([]);
	private _baseName = signal<string>('');

	// === Computed ===
	headers = computed(() => this._headers());
	headersData = computed(() => this._headersData());
	headersToKeep = computed(() => this._headersToKeep());
	headersToSplit = computed(() => this._headersToSplit());
	baseName = computed(() => this._baseName());
	fileId = computed(() => this.uploadedFile()?.file_id ?? null);
	filename = computed(() => this.uploadedFile()?.filename ?? null);
	hasFile = computed(() => this.uploadedFile() !== null);

	// === Métodos para modificar el estado ===
	setUploadedFile(fileInfo: UploadedFileInfo) {
		this.uploadedFile.set(fileInfo);
		const nameWithoutExt = fileInfo.filename.replace(/\.[^/.]+$/, '');
		this.setBaseName(nameWithoutExt);
		console.log('📁 Archivo guardado:', fileInfo);
	}

	setHeaders(headers: string[]) {
		this._headers.set(headers);
		console.log('📋 Headers guardados:', headers);
	}

	setHeadersData(headersData: HeaderDataItem[]) {
		this._headersData.set(headersData);
		console.log('📋 HeadersData guardados:', headersData);
	}

	setHeadersToKeep(headers: string[]) {
		this._headersToKeep.set(headers);
		console.log('📋 HeadersToKeep guardados:', headers);
	}

	setHeadersToSplit(headers: string[]) {
		this._headersToSplit.set(headers);
		console.log('📋 HeadersToSplit guardados:', headers);
	}

	setBaseName(name: string) {
		this._baseName.set(name);
	}

	// === Métodos utilitarios ===
	getBaseName(): string {
		return this._baseName();
	}

	getCurrentFileId(): string | null {
		return this.fileId();
	}

	clearFile() {
		this.uploadedFile.set(null);
		this._headers.set([]);
		this._headersData.set([]);
		this._headersToKeep.set([]);
		this._headersToSplit.set([]);
		this._baseName.set('');
	}
}

