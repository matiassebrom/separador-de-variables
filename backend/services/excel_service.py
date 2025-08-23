import pandas as pd
import io
import time
from typing import Dict, TypedDict
from typing import Optional
from fastapi import HTTPException, UploadFile


# Definición de la estructura de cada archivo subido (similar a interface en TypeScript)
class FileData(TypedDict, total=False):
    df: pd.DataFrame
    filename: str
    header_to_split: Optional[str]
    headers_to_keep: Optional[list[str]]

# Estado en memoria: id -> FileData
file_store: Dict[str, FileData] = {}

def save_uploaded_file(file: UploadFile) -> str:
    """
    Guarda el archivo Excel subido en memoria y retorna un id único.
    """
    if not file.filename or not (file.filename.endswith('.xlsx') or file.filename.endswith('.xls')):
        raise HTTPException(status_code=400, detail="El archivo debe ser de tipo Excel (.xlsx o .xls)")
    contents = file.file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="El archivo está vacío")
    try:
        df = pd.read_excel(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al leer el archivo Excel: {str(e)}")
    file_id = str(int(time.time() * 1000))
    file_store[file_id] = {"df": df, "filename": file.filename, "header_to_split": None, "headers_to_keep": None}
    return file_id

def set_header_to_split(file_id: str, header: str) -> list:
    if file_id not in file_store:
       raise HTTPException(status_code=404, detail="ID de archivo no encontrado")
    headers = get_headers_by_id(file_id)
    if header not in headers:
        raise HTTPException(status_code=400, detail=f"Header '{header}' no está en la lista de headers")
    file_store[file_id]["header_to_split"] = header
    unique_values_in_header_to_split = get_unique_values_by_header(file_id, header)
    return unique_values_in_header_to_split

def get_headers_by_id(file_id: str):
    df = file_store[file_id]["df"]
    return list(df.columns)

def get_unique_values_by_header(file_id: str, header: str):
    # Se asume que file_id y header ya fueron validados
    df = file_store[file_id]["df"]
    unique_values = df[header].dropna().unique().tolist()
    return unique_values

def set_headers_to_keep(file_id: str, headers: list[str]) -> list[str]:
    if file_id not in file_store:
        raise HTTPException(status_code=404, detail="ID de archivo no encontrado")
    all_headers = get_headers_by_id(file_id)
    for h in headers:
        if h not in all_headers:
            raise HTTPException(status_code=400, detail=f"Header '{h}' no está en la lista de headers")
    file_store[file_id]["headers_to_keep"] = headers
    return headers


