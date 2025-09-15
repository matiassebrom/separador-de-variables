
# ==================== IMPORTS ====================
import os
import tempfile
import zipfile
import pandas as pd
import io
import time
from typing import Dict, TypedDict, Optional
from fastapi import HTTPException, UploadFile

# ==================== UTILIDADES ====================
def cleanup_file(path: str):
    try:
        if os.path.exists(path):
            os.unlink(path)
    except Exception as e:
        print(f"Error cleaning up {path}: {e}")

def get_zip_base_name(file_id: str) -> str:
    data = file_store[file_id]
    base_name = data.get("base_name")
    if not base_name:
        base_name = data.get("filename", f"archivos_{file_id}")
        base_name = base_name.rsplit('.', 1)[0]
    return base_name

# ==================== MODELOS Y ESTADO ====================
class FileData(TypedDict, total=False):
    df: pd.DataFrame
    filename: str
    header_to_split: Optional[str]
    header_to_filter: Optional[str]  # Nuevo campo
    headers_to_keep: Optional[list[str]]
    values_to_keep_by_header: Optional[dict[str, list]]

file_store: Dict[str, FileData] = {}


# ==================== PASO 1: SUBIR ARCHIVO ====================
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


# ==================== PASO 2: ELEGIR 'SEPARAR POR' ====================
def set_header_to_split(file_id: str, header: str) -> list:
    if file_id not in file_store:
        raise HTTPException(status_code=404, detail="ID de archivo no encontrado")
    headers = get_headers_by_id(file_id)
    if header not in headers:
        raise HTTPException(status_code=400, detail=f"Header '{header}' no está en la lista de headers")
    file_store[file_id]["header_to_split"] = header
    unique_values_in_header_to_split = get_unique_values_by_header(file_id, header)
    return unique_values_in_header_to_split


# ==================== PASO 2: ELEGIR 'SEPARAR POR' ====================
def get_headers_by_id(file_id: str):
    df = file_store[file_id]["df"]
    return list(df.columns)


# ==================== PASO 3: OBTENER VALORES ÚNICOS DE UNA COLUMNA ====================
def get_unique_values_by_header(file_id: str, header: str):
    # Se asume que file_id y header ya fueron validados
    df = file_store[file_id]["df"]
    unique_values = df[header].dropna().unique().tolist()
    return unique_values


# ==================== PASO 4: ELEGIR 'DATOS A GUARDAR' ====================
def set_headers_to_keep(file_id: str, headers: list[str]) -> list:
    if file_id not in file_store:
        raise HTTPException(status_code=404, detail="ID de archivo no encontrado")
    all_headers = get_headers_by_id(file_id)
    for h in headers:
        if h not in all_headers:
            raise HTTPException(status_code=400, detail=f"Header '{h}' no está en la lista de headers")
    file_store[file_id]["headers_to_keep"] = headers
    # Si no hay header_to_filter, setear los valores únicos del header_to_split como valores a mantener
    if "header_to_filter" not in file_store[file_id] or not file_store[file_id]["header_to_filter"]:
        header_to_split = file_store[file_id].get("header_to_split")
        if header_to_split:
            unique_values = get_unique_values_by_header(file_id, header_to_split)
            if "values_to_keep_by_header" not in file_store[file_id] or file_store[file_id]["values_to_keep_by_header"] is None:
                file_store[file_id]["values_to_keep_by_header"] = {}
            file_store[file_id]["values_to_keep_by_header"][header_to_split] = unique_values
    # Si hay al menos un header, devolver los valores únicos del primero
    if headers:
        return headers
    return []


# ==================== PASO 3: CONFIGURAR FILTROS (OPCIONAL) ====================
def set_values_to_keep_by_header(file_id: str, header: str, values: list) -> list:
    if file_id not in file_store:
        raise HTTPException(status_code=404, detail="ID de archivo no encontrado")
    all_headers = get_headers_by_id(file_id)
    if header not in all_headers:
        raise HTTPException(status_code=400, detail=f"Header '{header}' no está en la lista de headers")
    # Inicializar el dict si no existe
    if "values_to_keep_by_header" not in file_store[file_id] or file_store[file_id]["values_to_keep_by_header"] is None:
        file_store[file_id]["values_to_keep_by_header"] = {}
    file_store[file_id]["header_to_filter"] = header  # Guardar header a filtrar
    file_store[file_id]["values_to_keep_by_header"][header] = values
    return values


# ==================== PASO 5: GENERAR Y DESCARGAR ARCHIVOS ====================
def generate_excels_by_value(file_id: str) -> str:
    data = check_ready_for_download(file_id)
    df = data["df"]
    header_to_split = data["header_to_split"]
    headers_to_keep = data["headers_to_keep"]
    # Filtrar por header_to_filter si existe
    header_to_filter = data.get("header_to_filter")
    if header_to_filter and header_to_filter in data["values_to_keep_by_header"]:
        filter_values = data["values_to_keep_by_header"][header_to_filter]
        df = df[df[header_to_filter].isin(filter_values)]
    # Iterar sobre los valores únicos de header_to_split
    unique_values_to_split = df[header_to_split].dropna().unique().tolist()
    # Usar base_name si está seteado, si no, usar nombre original
    base_name = data.get("base_name")
    if not base_name:
        original_filename = data.get("filename", "archivo")
        base_name = original_filename.rsplit(".", 1)[0]
    # Crear un ZIP temporal
    with tempfile.NamedTemporaryFile(delete=False, suffix=".zip") as tmp_zip:
        with zipfile.ZipFile(tmp_zip, 'w') as zipf:
            for value_to_split in unique_values_to_split:
                split_df = df[df[header_to_split] == value_to_split]
                if split_df.empty:
                    continue
                split_df = split_df[headers_to_keep]
                # Guardar Excel en memoria
                with tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx") as tmp_xlsx:
                    split_df.to_excel(tmp_xlsx.name, index=False)
                    arcname = f"{base_name} {value_to_split}.xlsx"
                    zipf.write(tmp_xlsx.name, arcname=arcname)
        return tmp_zip.name


# ==================== PASO 5: GENERAR Y DESCARGAR ARCHIVOS ====================
def check_ready_for_download(file_id: str):
    if file_id not in file_store:
        raise HTTPException(status_code=404, detail="No se encontró el archivo subido. Por favor, vuelve a cargar el archivo.")
    data = file_store[file_id]
    required = ["df", "header_to_split", "headers_to_keep", "values_to_keep_by_header"]
    friendly_names = {
        "df": "archivo Excel subido",
        "header_to_split": "columna para separar los archivos",
        "headers_to_keep": "columnas a guardar en los archivos generados",
        "values_to_keep_by_header": "valores a mantener para la columna seleccionada"
    }
    for key in required:
        if key not in data or data[key] is None:
            raise HTTPException(
                status_code=400,
                detail=f"Falta configurar el paso: {friendly_names.get(key, key)}. Completa ese paso antes de descargar."
            )
    # Usar header_to_filter si existe, si no, usar header_to_split
    header = data.get("header_to_filter", data["header_to_split"])
    if header not in data["values_to_keep_by_header"]:
        raise HTTPException(
            status_code=400,
            detail=f"Faltan valores a mantener para la columna '{header}'. Selecciona al menos un valor antes de descargar."
        )
    return data