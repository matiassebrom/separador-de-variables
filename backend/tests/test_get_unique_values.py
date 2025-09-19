import os
from fastapi.testclient import TestClient
from backend.main import app

import pytest

def test_get_unique_values_by_header_endpoint():
    client = TestClient(app)
    test_file_path = os.path.join(os.path.dirname(__file__), "excel para test.xlsx")
    with open(test_file_path, "rb") as f:
        upload_response = client.post(
            "/upload_file",
            files={"file": ("excel para test.xlsx", f, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
        )

    # Verifica que la subida fue exitosa
    assert upload_response.status_code == 200, f"Status inesperado al subir archivo: {upload_response.status_code}, body: {upload_response.text}"
    file_id = upload_response.json()["file_id"]

    # Probar endpoint get_unique_values
    response = client.post(f"/get_unique_values/{file_id}", json={"header": "ORIGEN"})
    assert response.status_code == 200, f"Status inesperado al obtener valores únicos: {response.status_code}, body: {response.text}"
    data = response.json()

    # Verifica que la clave esté en la respuesta
    assert "unique_values" in data, f"No se encontró 'unique_values' en la respuesta: {data}"

    # Verifica los valores únicos esperados
    expected = {"ORIGEN", "GURUS", "OPI", "TAP"}
    assert set(data["unique_values"]) == expected, f"Valores únicos inesperados: {data['unique_values']}\nEsperados: {expected}"

    # Comentario: Si este test falla, revisar el endpoint /get_unique_values/{file_id} y los datos del archivo de test.
