import os
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

import pytest
@pytest.mark.skip(reason="Función no utilizada actualmente")
def test_set_base_name():
    # Usar el archivo Excel fijo para los tests
    test_file_path = os.path.join(os.path.dirname(__file__), "excel para test.xlsx")
    with open(test_file_path, "rb") as f:
        upload_response = client.post(
            "/upload_file",
            files={"file": ("excel para test.xlsx", f, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
        )
    assert upload_response.status_code == 200, f"Status inesperado al subir archivo: {upload_response.status_code}, body: {upload_response.text}"
    file_id = upload_response.json()["file_id"]

    # Setear base_name
    base_name = "mi_archivo_zip"
    response = client.post(f"/set_base_name/{file_id}", json={"base_name": base_name})
    assert response.status_code == 200, f"Status inesperado al setear base_name: {response.status_code}, body: {response.text}"
    data = response.json()
    assert data["message"].startswith(f"Base name set to '{base_name}'"), f"Mensaje inesperado: {data['message']}"

    # Comentario: Si este test falla, revisar el endpoint /set_base_name/{file_id} y la lógica de almacenamiento en file_store.
