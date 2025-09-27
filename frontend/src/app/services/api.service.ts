
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// ==================== INTERFACES ====================




// PASO 1: SUBIR ARCHIVO
export interface UploadFileResponse {
	file_id: string;
	filename: string;
	message: string;
}

// PASO 2: ELEGIR 'SEPARAR POR'
export interface HeadersResponse {
	headers: string[];
}
export interface UniqueValuesResponse {
	unique_values_in_header_to_split: string[];
}

// PASO 3: OBTENER VALORES ÚNICOS DE UNA COLUMNA
export interface GetUniqueValuesRequest {
	header: string;
}
export interface GetUniqueValuesResponse {
	unique_values: string[];
}

// PASO 3: CONFIGURAR FILTROS (OPCIONAL)
export interface ValuesToKeepByHeaderRequest {
	header: string;
	values: string[];
}
export interface ValuesToKeepByHeaderResponse {
	header: string;
	values: string[];
}

// PASO 4: ELEGIR 'DATOS A GUARDAR'
export interface SetHeadersToKeepResponse {
	headers?: string[]; // opcional, para compatibilidad
	unique_values: string[];
}

// PASO 5: NOMBRE BASE Y DESCARGAR
export interface SetBaseNameRequest {
	base_name: string;
}

@Injectable({
	providedIn: 'root'
})
export class ApiService {
	private baseUrl = environment.apiUrl;

	constructor(private http: HttpClient) {}

	// ==================== PASO 0: PING ====================
	pingBackend(): Observable<any> {
		return this.http.get(`${this.baseUrl}/`);
	}

	// ==================== PASO 1: SUBIR ARCHIVO ====================
	uploadFile(formData: FormData): Observable<UploadFileResponse> {
		// backend espera el campo 'file' en form-data
		return this.http.post<UploadFileResponse>(`${this.baseUrl}/upload_file`, formData);
	}

	// ==================== OBTENER HEADERS Y DATOS ====================
	getHeaders(fileId: string): Observable<string[]> {
		return this.http.get<HeadersResponse>(`${this.baseUrl}/get_headers/${fileId}`).pipe(map(r => r.headers));
	}

	getHeadersData(fileId: string): Observable<any> {
		return this.http.get(`${this.baseUrl}/get_headers_data/${fileId}`);
	}

	// ==================== OBTENER VALORES ÚNICOS ====================
	getUniqueValues(fileId: string, header: string): Observable<string[]> {
		return this.http.post<GetUniqueValuesResponse>(`${this.baseUrl}/get_unique_values/${fileId}`, { header }).pipe(
			map(r => r.unique_values)
		);
	}


	// ==================== ELEGIR 'DATOS A GUARDAR' ====================
	setHeadersToKeep(fileId: string, headers: string[]): Observable<string[]> {
		const body = { headers };
		return this.http.post<SetHeadersToKeepResponse>(`${this.baseUrl}/set_headers_to_keep/${fileId}`, body).pipe(
			map(r => r.unique_values ?? r.headers ?? [])
		);
	}

	// ==================== ELEGIR 'SEPARAR POR' ====================
	setHeadersToSplit(fileId: string, headers: string[]): Observable<number> {
		const body = { headers };
		return this.http.post<any>(`${this.baseUrl}/set_headers_to_split/${fileId}`, body).pipe(map(r => r.count_headers_to_split));
	}

	// ==================== PASO 5: NOMBRE BASE Y DESCARGAR ====================
	setBaseName(fileId: string, baseName: string): Observable<any> {
		return this.http.post<any>(`${this.baseUrl}/set_base_name/${fileId}`, { base_name: baseName });
	}

	downloadFiles(fileId: string): Observable<Blob> {
		return this.http.get(`${this.baseUrl}/download_files/${fileId}`, { responseType: 'blob' as 'json' }) as Observable<Blob>;
	}
}
