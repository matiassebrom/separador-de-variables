import tempfile
import zipfile

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
    values_to_keep_by_header: Optional[dict[str, list]]

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


def set_headers_to_keep(file_id: str, headers: list[str]) -> list:
    if file_id not in file_store:
        raise HTTPException(status_code=404, detail="ID de archivo no encontrado")
    all_headers = get_headers_by_id(file_id)
    for h in headers:
        if h not in all_headers:
            raise HTTPException(status_code=400, detail=f"Header '{h}' no está en la lista de headers")
    file_store[file_id]["headers_to_keep"] = headers
    # Si hay al menos un header, devolver los valores únicos del primero
    if headers:
        return get_unique_values_by_header(file_id, headers[0])
    return []

def set_values_to_keep_by_header(file_id: str, header: str, values: list) -> list:
    if file_id not in file_store:
        raise HTTPException(status_code=404, detail="ID de archivo no encontrado")
    all_headers = get_headers_by_id(file_id)
    if header not in all_headers:
        raise HTTPException(status_code=400, detail=f"Header '{header}' no está en la lista de headers")
    # Inicializar el dict si no existe
    if "values_to_keep_by_header" not in file_store[file_id] or file_store[file_id]["values_to_keep_by_header"] is None:
        file_store[file_id]["values_to_keep_by_header"] = {}
    file_store[file_id]["values_to_keep_by_header"][header] = values
    return values

def generate_excels_by_value(file_id: str) -> str:
    data = check_ready_for_download(file_id)
    df = data["df"]
    header = data["header_to_split"]
    headers_to_keep = data["headers_to_keep"]
    values_to_keep_by_header = data["values_to_keep_by_header"][header]
    # Crear un ZIP temporal
    original_filename = data.get("filename", "archivo")
    base_name = original_filename.rsplit(".", 1)[0]
    with tempfile.NamedTemporaryFile(delete=False, suffix=".zip") as tmp_zip:
        with zipfile.ZipFile(tmp_zip, 'w') as zipf:
            for value_to_keep in values_to_keep_by_header:
                filtered_df = df[df[header] == value_to_keep]
                if filtered_df.empty:
                    continue
                filtered_df = filtered_df[headers_to_keep]
                # Guardar Excel en memoria
                with tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx") as tmp_xlsx:
                    filtered_df.to_excel(tmp_xlsx.name, index=False)
                    arcname = f"{base_name} {value_to_keep}.xlsx"
                    zipf.write(tmp_xlsx.name, arcname=arcname)
        return tmp_zip.name

def check_ready_for_download(file_id: str):
    if file_id not in file_store:
        raise HTTPException(status_code=404, detail="ID de archivo no encontrado")
    data = file_store[file_id]
    required = ["df", "header_to_split", "headers_to_keep", "values_to_keep_by_header"]
    for key in required:
        if key not in data or data[key] is None:
            raise HTTPException(status_code=400, detail=f"Falta configurar: {key}")
    header = data["header_to_split"]
    if header not in data["values_to_keep_by_header"]:
        raise HTTPException(status_code=400, detail=f"Faltan valores a mantener para '{header}'")
    return data