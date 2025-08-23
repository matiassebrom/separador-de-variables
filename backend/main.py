from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from backend.services.excel_service import load_excel_to_dataframe

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "¡Hola mundo desde FastAPI!"}

# Ruta para subir archivos Excel
@app.post("/upload_file")
async def upload_file(file: UploadFile = File(...)) -> JSONResponse:
    """
    Sube un archivo Excel y confirma la carga.
    """
    # Leer y validar el archivo usando el servicio
    df = load_excel_to_dataframe(file)
    # Confirmar la carga
    return JSONResponse(content={"filename": file.filename, "message": "Archivo cargado exitosamente"})
