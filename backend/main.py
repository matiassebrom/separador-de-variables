import os
from fastapi.responses import FileResponse
from fastapi import BackgroundTasks, FastAPI, UploadFile, File, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List
from services.excel_service import save_uploaded_file, get_headers_by_id, get_unique_values_by_header, set_header_to_split as set_header_to_split_service, set_headers_to_keep as set_headers_to_keep_service, set_values_to_keep_by_header as set_header_to_split_service_service, generate_excels_by_value


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


# Modelo único para request y response
class ValuesToKeepByHeader(BaseModel):
    header: str
    values: list

# ------------------- APP Y ENDPOINTS -------------------

app = FastAPI()

# Permitir CORS para desarrollo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambia esto a la URL de tu frontend en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "¡Hola mundo desde FastAPI!"}

@app.post("/upload_file", response_model=UploadFileResponse)
async def upload_file(file: UploadFile = File(...)) -> UploadFileResponse:
    """
    Sube un archivo Excel, lo guarda en memoria y retorna un id único.
    """
    file_id = save_uploaded_file(file)
    filename = file.filename if file.filename is not None else "archivo.xlsx"
    return UploadFileResponse(file_id=file_id, filename=filename, message="Archivo cargado exitosamente")

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

@app.post("/set_values_to_keep_by_header/{file_id}", response_model=ValuesToKeepByHeader)
def set_values_to_keep_by_header(file_id: str, body: ValuesToKeepByHeader) -> ValuesToKeepByHeader:
    values = set_header_to_split_service_service(file_id, body.header, body.values)
    return ValuesToKeepByHeader(header=body.header, values=values)

# Descargar archivos generados según la configuración guardada
@app.get("/download_files/{file_id}")
def download_files(file_id: str, background_tasks: BackgroundTasks):
    zip_path = generate_excels_by_value(file_id)

    def cleanup():
        try:
            if os.path.exists(zip_path):
                os.unlink(zip_path)
        except Exception as e:
            print(f"Error cleaning up {zip_path}: {e}")

    background_tasks.add_task(cleanup)
    
    return FileResponse(zip_path, 
        filename=f"archivos_{file_id}.zip", 
        media_type="application/zip"
    ) 