import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ApiService {
	private baseUrl = 'http://localhost:8000'; // Cambia el puerto si tu backend usa otro

	constructor(private http: HttpClient) {}

	pingBackend(): Observable<any> {
		return this.http.get(`${this.baseUrl}/`);
	}

	uploadExcel(formData: FormData): Observable<any> {
		return this.http.post(`${this.baseUrl}/upload_file`, formData);
	}
}
