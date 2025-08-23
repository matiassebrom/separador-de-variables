import pandas as pd
import io
import time
from typing import Dict, TypedDict
from fastapi import HTTPException, UploadFile


# Definición de la estructura de cada archivo subido (similar a interface en TypeScript)
class FileData(TypedDict):
    df: pd.DataFrame
    filename: str

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
    file_store[file_id] = {"df": df, "filename": file.filename}
    return file_id

def get_headers_by_id(file_id: str):
    if file_id not in file_store:
        raise HTTPException(status_code=404, detail="ID de archivo no encontrado")
    df = file_store[file_id]["df"]
    return list(df.columns)

def get_unique_values_by_header(file_id: str, header: str):
    if file_id not in file_store:
        raise HTTPException(status_code=404, detail="ID de archivo no encontrado")
    df = file_store[file_id]["df"]
    if header not in df.columns:
        raise HTTPException(status_code=404, detail=f"Header '{header}' no encontrado en el archivo")
    unique_values = df[header].dropna().unique().tolist()
    return unique_values


