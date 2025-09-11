import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UploadFileResponse {
	file_id: string;
	filename: string;
	message: string;

}

export interface ValuesToKeepByHeaderRequest {
	header: string;
	values: string[];
}

export interface ValuesToKeepByHeaderResponse {
	header: string;
	values: string[];
}

export interface HeadersResponse {
	headers: string[];
}

export interface UniqueValuesResponse {
	unique_values_in_header_to_split: string[];
}

// Nueva interfaz para la respuesta del endpoint set_headers_to_keep
export interface SetHeadersToKeepResponse {
	headers: string[];
	unique_values: string[];
}

@Injectable({
	providedIn: 'root',
})
export class ApiService {
	private baseUrl = 'http://localhost:8000';

	constructor(private http: HttpClient) {}

	pingBackend(): Observable<any> {
		return this.http.get(`${this.baseUrl}/`);
	}

	uploadExcel(formData: FormData): Observable<UploadFileResponse> {
			return this.http.post<UploadFileResponse>(`${this.baseUrl}/upload_file`, formData);
	}

	getHeaders(fileId: string): Observable<HeadersResponse> {
		return this.http.get<HeadersResponse>(`${this.baseUrl}/get_headers/${fileId}`);
	}

	setHeaderToSplit(fileId: string, header: string) {
		return this.http.post<UniqueValuesResponse>(`${this.baseUrl}/set_header_to_split/${fileId}`, { header });
	}

	/**
	 * Llama al endpoint para establecer los headers a mantener
	 * @param fileId string
	 * @param headers string[]
	 */
		setHeadersToKeep(fileId: string, headers: string[]): Observable<SetHeadersToKeepResponse> {
			const body = { headers };
			return this.http.post<SetHeadersToKeepResponse>(`${this.baseUrl}/set_headers_to_keep/${fileId}`, body);
		}


	setValuesToKeepByHeader(fileId: string, header: string, values: string[]): Observable<ValuesToKeepByHeaderResponse> {
		const body = { header, values };
		return this.http.post<ValuesToKeepByHeaderResponse>(`${this.baseUrl}/set_values_to_keep_by_header/${fileId}`, body);
	}


	}

