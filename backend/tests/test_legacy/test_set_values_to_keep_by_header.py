import os
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

import pytest
@pytest.mark.skip(reason="Función no utilizada actualmente")
def test_set_values_to_keep_by_header():
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

    # Probar set_values_to_keep_by_header
    header = "ORIGEN"
    values = ["GURUS", "TAP"]
    response = client.post(f"/set_values_to_keep_by_header/{file_id}", json={"header": header, "values": values})
    assert response.status_code == 200, f"Status inesperado al setear valores: {response.status_code}, body: {response.text}"
    data = response.json()

    # Verifica que el header retornado sea el esperado
    assert data["header"] == header, f"Header inesperado: {data['header']}\nEsperado: {header}"

    # Verifica que los valores retornados sean los esperados
    assert set(data["values"]) == set(values), f"Valores retornados inesperados: {data['values']}\nEsperados: {values}"

    # Comentario: Si este test falla, revisar el endpoint /set_values_to_keep_by_header/{file_id} y la lógica de filtrado.
