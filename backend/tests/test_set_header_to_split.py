import os
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_set_header_to_split():
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

    # Probar set_header_to_split
    response = client.post(f"/set_header_to_split/{file_id}", json={"header": "ORIGEN"})
    assert response.status_code == 200, f"Status inesperado al setear header: {response.status_code}, body: {response.text}"
    data = response.json()

    # Verifica que la clave esté en la respuesta
    assert "unique_values_in_header_to_split" in data, f"No se encontró 'unique_values_in_header_to_split' en la respuesta: {data}"

    # Verifica los valores únicos esperados
    expected_values = {"ORIGEN", "GURUS", "OPI", "TAP"}
    assert set(data["unique_values_in_header_to_split"]) == expected_values, f"Valores únicos inesperados: {data['unique_values_in_header_to_split']}\nEsperados: {expected_values}"

    # Comentario: Si este test falla, revisar el endpoint /set_header_to_split/{file_id} y los datos del archivo de test.
