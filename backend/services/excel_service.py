import pandas as pd
import io

from fastapi import HTTPException, UploadFile

def load_excel_to_dataframe(file: UploadFile) -> pd.DataFrame:
    """
    Lee un archivo Excel subido y lo convierte en un DataFrame de pandas.
    Lanza HTTPException si hay errores de formato o contenido.
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
    return df
