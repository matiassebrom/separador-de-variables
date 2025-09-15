import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ==================== PASO 1: SUBIR ARCHIVO ====================
// Interfaces para PASO 1
export interface UploadFileResponse {
	file_id: string;
	filename: string;
	message: string;
}

// ==================== PASO 2: ELEGIR 'SEPARAR POR' ====================
// Interfaces para PASO 2
export interface HeadersResponse {
	headers: string[];
}

export interface UniqueValuesResponse {
	unique_values_in_header_to_split: string[];
}

// ==================== PASO 3: CONFIGURAR FILTROS (OPCIONAL) ====================
// Interfaces para PASO 3
export interface ValuesToKeepByHeaderRequest {
	header: string;
	values: string[];
}

export interface ValuesToKeepByHeaderResponse {
	header: string;
	values: string[];
}

// ==================== PASO 4: ELEGIR 'DATOS A GUARDAR' ====================
// Interfaces para PASO 4
export interface SetHeadersToKeepResponse {
	headers?: string[]; // opcional, para compatibilidad
	unique_values: string[];
}
@Injectable({
	providedIn: 'root'
})
export class ApiService {
	private baseUrl = 'http://localhost:8000';

	constructor(private http: HttpClient) {}

	pingBackend(): Observable<any> {
		return this.http.get(`${this.baseUrl}/`);
	}

	// ==================== PASO 1: SUBIR ARCHIVO ====================
	uploadExcel(formData: FormData): Observable<UploadFileResponse> {
		return this.http.post<UploadFileResponse>(`${this.baseUrl}/upload_file`, formData);
	}

	// ==================== PASO 2: ELEGIR 'SEPARAR POR' ====================
	getHeaders(fileId: string): Observable<HeadersResponse> {
		return this.http.get<HeadersResponse>(`${this.baseUrl}/get_headers/${fileId}`);
	}

	setHeaderToSplit(fileId: string, header: string) {
		return this.http.post<UniqueValuesResponse>(`${this.baseUrl}/set_header_to_split/${fileId}`, { header });
	}

	// ==================== PASO 3: CONFIGURAR FILTROS (OPCIONAL) ====================
	setValuesToKeepByHeader(fileId: string, header: string, values: string[]): Observable<ValuesToKeepByHeaderResponse> {
		const body = { header, values };
		return this.http.post<ValuesToKeepByHeaderResponse>(`${this.baseUrl}/set_values_to_keep_by_header/${fileId}`, body);
	}

	// ==================== PASO 4: ELEGIR 'DATOS A GUARDAR' ====================
	/**
	 * Llama al endpoint para establecer los headers a mantener
	 * @param fileId string
	 * @param headers string[]
	 */
	setHeadersToKeep(fileId: string, headers: string[]): Observable<SetHeadersToKeepResponse> {
		const body = { headers };
		return this.http.post<SetHeadersToKeepResponse>(`${this.baseUrl}/set_headers_to_keep/${fileId}`, body);
	}

	// ==================== PASO 5: NOMBRE BASE Y DESCARGAR ====================
	// Aquí podrías agregar métodos para descargar archivos si es necesario

	// ==================== LÓGICA PENDIENTE ====================
	// Aquí puedes agregar métodos para pasos adicionales si es necesario
}
