from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from backend.services.excel_service import save_uploaded_file, get_headers_by_id

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "¡Hola mundo desde FastAPI!"}

# Ruta para subir archivos Excel

@app.post("/upload_file")
async def upload_file(file: UploadFile = File(...)) -> JSONResponse:
    """
    Sube un archivo Excel, lo guarda en memoria y retorna un id único.
    """
    file_id = save_uploaded_file(file)
    return JSONResponse(content={"file_id": file_id, "filename": file.filename, "message": "Archivo cargado exitosamente"})


# Endpoint para obtener los headers del archivo subido por id
@app.get("/get_headers/{file_id}")
def get_headers(file_id: str) -> JSONResponse:
    headers = get_headers_by_id(file_id)
    return JSONResponse(content={"headers": headers})


