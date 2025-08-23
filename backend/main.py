from fastapi import FastAPI, UploadFile, File, HTTPException, Body
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List
from backend.services.excel_service import save_uploaded_file, get_headers_by_id, get_unique_values_by_header, set_header_to_split as set_header_to_split_service, set_headers_to_keep as set_headers_to_keep_service

# ------------------- MODELOS -------------------
class UploadFileResponse(BaseModel):
    file_id: str
    filename: str
    message: str

class HeadersResponse(BaseModel):
    headers: List[str]

class UniqueValuesResponse(BaseModel):
    unique_values_in_header_to_split: List[str]

class SetHeaderToSplitRequest(BaseModel):
    header: str

# ------------------- APP Y ENDPOINTS -------------------
app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "¡Hola mundo desde FastAPI!"}

@app.post("/upload_file", response_model=UploadFileResponse)
async def upload_file(file: UploadFile = File(...)) -> UploadFileResponse:
    """
    Sube un archivo Excel, lo guarda en memoria y retorna un id único.
    """
    file_id = save_uploaded_file(file)
    return UploadFileResponse(file_id=file_id, filename=file.filename, message="Archivo cargado exitosamente")

@app.get("/get_headers/{file_id}", response_model=HeadersResponse)
def get_headers(file_id: str) -> HeadersResponse:
    """Obtiene los headers del archivo especificado por file_id."""
    headers = get_headers_by_id(file_id)
    return HeadersResponse(headers=headers)


@app.post("/set_header_to_split/{file_id}", response_model=UniqueValuesResponse)
def set_header_to_split(file_id: str, body: SetHeaderToSplitRequest) -> UniqueValuesResponse:
    """
    Establece el header por el cual se dividirá el archivo y retorna los valores únicos de ese header.
    """
    unique_values_in_header_to_split = set_header_to_split_service(file_id, body.header)
    return UniqueValuesResponse(unique_values_in_header_to_split=unique_values_in_header_to_split)

@app.post("/set_headers_to_keep/{file_id}", response_model=HeadersResponse)
def set_headers_to_keep(file_id: str, headers: HeadersResponse = Body(...)) -> HeadersResponse:
    set_headers_to_keep_service(file_id, headers.headers)
    return HeadersResponse(headers=headers.headers)