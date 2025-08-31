import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UploadFileResponse {
	file_id: string;
	filename: string;
	message: string;
}

export interface HeadersResponse {
	headers: string[];
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
}
