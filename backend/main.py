
import os
from fastapi.responses import FileResponse
from fastapi import BackgroundTasks, FastAPI, UploadFile, File, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List
from backend.services.excel_service import (
    save_uploaded_file,
    get_headers_by_id,
    get_headers_data_by_id,
    get_unique_values_by_header,
    file_store,
    cleanup_file,
    get_zip_base_name,
    set_headers_to_keep,
    generate_excels_by_value,
)


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

# Modelo para el nombre base de descarga
class SetBaseNameRequest(BaseModel):
    base_name: str

# Modelo para obtener valores únicos
class GetUniqueValuesRequest(BaseModel):
    header: str

# ------------------- APP Y ENDPOINTS -------------------

app = FastAPI()



# Permitir CORS para desarrollo
frontend_url = os.getenv("FRONTEND_URL", "*")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== HEALTH CHECK ====================
@app.get("/")
def read_root():
    return {"message": "¡Hola mundo desde FastAPI!"}

# ==================== PASO 1: SUBIR ARCHIVO ====================
@app.post("/upload_file", response_model=UploadFileResponse)
async def upload_file(file: UploadFile = File(...)) -> UploadFileResponse:
    """
    Sube un archivo Excel, lo guarda en memoria y retorna un id único.
    """
    file_id = save_uploaded_file(file)
    filename = file.filename if file.filename is not None else "archivo.xlsx"
    return UploadFileResponse(file_id=file_id, filename=filename, message="Archivo cargado exitosamente")


# ==================== OBTENER INFORMACIÓN DEL ARCHIVO ====================
@app.get("/get_headers/{file_id}", response_model=HeadersResponse)
def get_headers(file_id: str) -> HeadersResponse:
    """Obtiene los headers del archivo especificado por file_id."""
    headers = get_headers_by_id(file_id)
    return HeadersResponse(headers=headers)


@app.get("/get_headers_data/{file_id}")
def get_headers_data(file_id: str):
    """
    Devuelve un array con header, cantidad de respuestas totales y cantidad de respuestas únicas por columna.
    """
    return get_headers_data_by_id(file_id)


@app.post("/get_unique_values/{file_id}")
def get_unique_values(file_id: str, body: GetUniqueValuesRequest):
    """
    Devuelve los valores únicos de una columna específica del archivo subido.
    """
    try:
        values = get_unique_values_by_header(file_id, body.header)
        return {"unique_values": values}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== PASO 2: Elegir columna para mantener ====================
class SetHeadersToKeepRequest(BaseModel):
    headers: list[str]

@app.post("/set_headers_to_keep/{file_id}")
def set_headers_to_keep_endpoint(file_id: str, body: SetHeadersToKeepRequest):
    """
    Guarda las columnas que el usuario quiere mantener en todos los archivos generados.
    """
    unique_headers = set_headers_to_keep(file_id, body.headers)
    return {"headers_kept": unique_headers}

# ==================== PASO 3: Elegir columna para separar ====================
class SetHeadersToSplitRequest(BaseModel):
    headers: list[str]
@app.post("/set_headers_to_split/{file_id}")
def set_headers_to_split(file_id: str, body: SetHeadersToSplitRequest):
    """
    Establece los headers por los cuales se dividirá el archivo y retorna la cantidad de headers seleccionados.
    """
    from backend.services.excel_service import set_headers_to_split
    set_headers_to_split(file_id, body.headers)
    return {"count_headers_to_split": len(body.headers)}


# ==================== PASO 5: NOMBRE BASE Y DESCARGAR ====================
@app.post("/set_base_name/{file_id}")
def set_base_name(file_id: str, body: SetBaseNameRequest):
    if file_id not in file_store:
        raise HTTPException(status_code=404, detail="ID de archivo no encontrado")
    file_store[file_id]["base_name"] = body.base_name
    return {"message": f"Base name set to '{body.base_name}' for file {file_id}"}

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

    # Usar el base_name configurado para el nombre del zip
    base_name = get_zip_base_name(file_id)
    return FileResponse(zip_path, 
        filename=f"{base_name}.zip", 
        media_type="application/zip"
    )
'''
 # ==================== PASO 2: Elegir columna para separar ====================
@app.post("/set_header_to_split/{file_id}", response_model=UniqueValuesResponse)
def set_header_to_split(file_id: str, body: SetHeaderToSplitRequest) -> UniqueValuesResponse:
    """
    Establece el header por el cual se dividirá el archivo y retorna los valores únicos de ese header.
    """
    unique_values_in_header_to_split = set_header_to_split_service(file_id, body.header)
    return UniqueValuesResponse(unique_values_in_header_to_split=unique_values_in_header_to_split)



 # ==================== PASO 3: OBTENER VALORES ÚNICOS DE UNA COLUMNA ====================





# ==================== PASO 3: CONFIGURAR FILTROS (OPCIONAL) ====================
@app.post("/set_values_to_keep_by_header/{file_id}", response_model=ValuesToKeepByHeader)
def set_values_to_keep_by_header(file_id: str, body: ValuesToKeepByHeader) -> ValuesToKeepByHeader:
    values = set_values_to_keep_by_header_service(file_id, body.header, body.values)
    return ValuesToKeepByHeader(header=body.header, values=values)


# ==================== PASO 4: ELEGIR 'DATOS A GUARDAR' ====================
@app.post("/set_headers_to_keep/{file_id}")
def set_headers_to_keep(file_id: str, headers: HeadersResponse = Body(...)):
    unique_values = set_headers_to_keep_service(file_id, headers.headers)
    return {"unique_values": unique_values}

# ==================== PASO 5: NOMBRE BASE Y DESCARGAR ====================
@app.post("/set_base_name/{file_id}")
def set_base_name(file_id: str, body: SetBaseNameRequest):
    if file_id not in file_store:
        raise HTTPException(status_code=404, detail="ID de archivo no encontrado")
    file_store[file_id]["base_name"] = body.base_name
    return {"message": f"Base name set to '{body.base_name}' for file {file_id}"}

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

    # Usar el base_name configurado para el nombre del zip
    base_name = get_zip_base_name(file_id)
    return FileResponse(zip_path, 
        filename=f"{base_name}.zip", 
        media_type="application/zip"
    )
'''