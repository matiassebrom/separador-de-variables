import os
import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_upload_file():
    # Ruta a un archivo Excel de prueba
    test_file_path = os.path.join(os.path.dirname(__file__), "test.xlsx")
    # Crear un archivo Excel mínimo si no existe
    if not os.path.exists(test_file_path):
        import pandas as pd
        df = pd.DataFrame({"col1": [1, 2], "col2": [3, 4]})
        df.to_excel(test_file_path, index=False)
    with open(test_file_path, "rb") as f:
        response = client.post(
            "/upload_file",
            files={"file": ("test.xlsx", f, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
        )
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Archivo cargado exitosamente"
    assert data["filename"] == "test.xlsx"
