import os
import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_get_headers():
    # Usar el archivo Excel fijo para los tests
    test_file_path = os.path.join(os.path.dirname(__file__), "excel para test.xlsx")
    with open(test_file_path, "rb") as f:
        upload_response = client.post(
            "/upload_file",
            files={"file": ("excel para test.xlsx", f, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
        )
    assert upload_response.status_code == 200
    file_id = upload_response.json()["file_id"]

    # Obtener los headers usando el file_id
    headers_response = client.get(f"/get_headers/{file_id}")
    assert headers_response.status_code == 200
    data = headers_response.json()
    assert "headers" in data
    # Cambia aquí los headers esperados según el contenido real del archivo de test
    # Por ejemplo:
    # assert set(data["headers"]) == {"col1", "col2"}
