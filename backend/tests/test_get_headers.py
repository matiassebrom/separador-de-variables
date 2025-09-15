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

    # Verifica que la subida fue exitosa
    assert upload_response.status_code == 200, f"Status inesperado al subir archivo: {upload_response.status_code}, body: {upload_response.text}"
    file_id = upload_response.json()["file_id"]

    # Obtener los headers usando el file_id
    headers_response = client.get(f"/get_headers/{file_id}")
    assert headers_response.status_code == 200, f"Status inesperado al obtener headers: {headers_response.status_code}, body: {headers_response.text}"
    data = headers_response.json()

    # Verifica que la clave 'headers' esté en la respuesta
    assert "headers" in data, f"No se encontró 'headers' en la respuesta: {data}"

    # Verifica los headers esperados según el archivo de test
    expected_headers = [
        "StartDate", "RecordedDate", "ResponseId", "ORIGEN", "Q_TerminateFlag", "ETAPA", "ID",
        "TIPO", "EDAD", "EDAD_COD", "FILTRO", "CUOTAFULL", "F11-EMPRESARIAL", "suma_eval"
    ]
    assert data["headers"] == expected_headers, f"Headers inesperados: {data['headers']}\nEsperados: {expected_headers}"

    # Comentario: Si este test falla, revisar el endpoint /get_headers/{file_id} y el archivo de test.
