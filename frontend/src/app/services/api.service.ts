import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { UploadFileResponse } from '../interfaces/upload-file-response.interface';
import { HeadersResponse } from '../interfaces/headers-response.interface';
import { SetHeadersToKeepResponse } from '../interfaces/set-headers-to-keep-response.interface';


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

	// ==================== PASO 2:  ELEGIR 'DATOS A Mantener' ====================
	setHeadersToKeep(fileId: string, headers: string[]): Observable<string[]> {
		const body = { headers };
		return this.http.post<SetHeadersToKeepResponse>(`${this.baseUrl}/set_headers_to_keep/${fileId}`, body).pipe(
			map(r => r.unique_values ?? r.headers ?? [])
		);
	}

	// ==================== PASO 3: ELEGIR 'SEPARAR POR' ====================
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
