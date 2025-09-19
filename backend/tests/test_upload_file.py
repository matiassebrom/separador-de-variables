import os
import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_upload_file():
    # Usar el archivo Excel fijo para los tests
    test_file_path = os.path.join(os.path.dirname(__file__), "excel para test.xlsx")
    with open(test_file_path, "rb") as f:
        response = client.post(
            "/upload_file",
            files={"file": ("excel para test.xlsx", f, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
        )

    # Verifica que la respuesta HTTP sea exitosa
    assert response.status_code == 200, f"Status code inesperado: {response.status_code}, body: {response.text}"
    data = response.json()

    # Verifica que el mensaje sea el esperado
    assert data["message"] == "Archivo cargado exitosamente", f"Mensaje inesperado: {data['message']}"

    # Verifica que el nombre del archivo sea correcto
    assert data["filename"] == "excel para test.xlsx", f"Nombre de archivo inesperado: {data['filename']}"

    # Verifica que se retorne un file_id no vacío
    assert "file_id" in data and data["file_id"], "No se retornó file_id o está vacío"

    # Comentario: Si este test falla, revisar el endpoint /upload_file y el modelo UploadFileResponse.

