import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService, UploadFileResponse } from './api.service';
import { environment } from '../../environments/environment';



describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should ping backend', () => {
    service.pingBackend().subscribe((resp: any) => expect(resp).toEqual({ message: 'ok' }));
    const req = httpMock.expectOne(`${baseUrl}/`);
    expect(req.request.method).toBe('GET');
    req.flush({ message: 'ok' });
  });

  it('should upload file', () => {
    const fd = new FormData();
    fd.append('file', new Blob(['a']), 'test.xlsx');
    const mockResp: UploadFileResponse = { file_id: '123', filename: 'test.xlsx', message: 'ok' };
    service.uploadFile(fd).subscribe((r: UploadFileResponse) => expect(r).toEqual(mockResp));
    const req = httpMock.expectOne(`${baseUrl}/upload_file`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResp);
  });

  it('should get headers', () => {
    const fileId = '123';
    const headers = ['col1', 'col2'];
    service.getHeaders(fileId).subscribe((h: string[]) => expect(h).toEqual(headers));
    const req = httpMock.expectOne(`${baseUrl}/get_headers/${fileId}`);
    expect(req.request.method).toBe('GET');
    req.flush({ headers });
  });

  it('should get headers data', () => {
    const fileId = '123';
    const data = { col1: { total: 10, unique: 3 } };
    service.getHeadersData(fileId).subscribe((d: any) => expect(d).toEqual(data));
    const req = httpMock.expectOne(`${baseUrl}/get_headers_data/${fileId}`);
    expect(req.request.method).toBe('GET');
    req.flush(data);
  });

  it('should get unique values', () => {
    const fileId = '123';
    const header = 'col1';
    const values = ['a', 'b'];
    service.getUniqueValues(fileId, header).subscribe((v: string[]) => expect(v).toEqual(values));
    const req = httpMock.expectOne(`${baseUrl}/get_unique_values/${fileId}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ header });
    req.flush({ unique_values: values });
  });

  it('should set headers to keep', () => {
    const fileId = '123';
    const headers = ['col1', 'col2'];
    const unique_values = ['a', 'b'];
    service.setHeadersToKeep(fileId, headers).subscribe((r: string[]) => expect(r).toEqual(unique_values));
    const req = httpMock.expectOne(`${baseUrl}/set_headers_to_keep/${fileId}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ headers });
    req.flush({ unique_values });
  });

  it('should set headers to split', () => {
    const fileId = '123';
    const headers = ['colSplit'];
    service.setHeadersToSplit(fileId, headers).subscribe((count: number) => expect(count).toBe(1));
    const req = httpMock.expectOne(`${baseUrl}/set_headers_to_split/${fileId}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ headers });
    req.flush({ count_headers_to_split: 1 });
  });

  it('should set base name', () => {
    const fileId = '123';
    const baseName = 'mybase';
    service.setBaseName(fileId, baseName).subscribe((r: any) => expect(r).toEqual({ message: "ok" }));
    const req = httpMock.expectOne(`${baseUrl}/set_base_name/${fileId}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ base_name: baseName });
    req.flush({ message: 'ok' });
  });

  it('should download files', () => {
    const fileId = '123';
    const blob = new Blob(['a'], { type: 'application/zip' });
    service.downloadFiles(fileId).subscribe((b: Blob) => expect(b).toBeTruthy());
    const req = httpMock.expectOne(`${baseUrl}/download_files/${fileId}`);
    expect(req.request.method).toBe('GET');
    req.flush(blob);
  });

  
});
