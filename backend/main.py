from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List
from backend.services.excel_service import save_uploaded_file, get_headers_by_id, get_unique_values_by_header

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "¡Hola mundo desde FastAPI!"}

# Ruta para subir archivos Excel


# Modelo de respuesta para upload_file
class UploadFileResponse(BaseModel):
    file_id: str
    filename: str
    message: str

@app.post("/upload_file", response_model=UploadFileResponse)
async def upload_file(file: UploadFile = File(...)) -> UploadFileResponse:
    """
    Sube un archivo Excel, lo guarda en memoria y retorna un id único.
    """
    file_id = save_uploaded_file(file)
    return UploadFileResponse(file_id=file_id, filename=file.filename, message="Archivo cargado exitosamente")


# Endpoint para obtener los headers del archivo subido por id

# Modelo de respuesta para headers
class HeadersResponse(BaseModel):
    headers: List[str]

@app.get("/get_headers/{file_id}", response_model=HeadersResponse)
def get_headers(file_id: str) -> HeadersResponse:
    headers = get_headers_by_id(file_id)
    return HeadersResponse(headers=headers)

# Modelo de respuesta para valores únicos
class UniqueValuesResponse(BaseModel):
    unique_values: List[str]

# Endpoint para obtener los valores únicos de un header
@app.get("/get_unique_values/{file_id}/{header}", response_model=UniqueValuesResponse)
def get_unique_values(file_id: str, header: str) -> UniqueValuesResponse:
    unique_values = get_unique_values_by_header(file_id, header)
    return UniqueValuesResponse(unique_values=unique_values)