import os
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_set_headers_to_keep():
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

    # Probar set_headers_to_keep con un solo header
    response = client.post(f"/set_headers_to_keep/{file_id}", json={"headers": ["ORIGEN"]})
    assert response.status_code == 200, f"Status inesperado al setear headers: {response.status_code}, body: {response.text}"
    data = response.json()

    # Verifica que la clave esté en la respuesta
    assert "unique_values" in data, f"No se encontró 'unique_values' en la respuesta: {data}"

    # Debe devolver solo los headers enviados
    expected_values = {"ORIGEN"}
    assert set(data["unique_values"]) == expected_values, f"Valores únicos inesperados: {data['unique_values']}\nEsperados: {expected_values}"

    # Comentario: Si este test falla, revisar el endpoint /set_headers_to_keep/{file_id} y la lógica de filtrado.


def test_set_headers_to_keep_multiple():
    """Testea el endpoint con múltiples headers"""
    test_file_path = os.path.join(os.path.dirname(__file__), "excel para test.xlsx")
    with open(test_file_path, "rb") as f:
        upload_response = client.post(
            "/upload_file",
            files={"file": ("excel para test.xlsx", f, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
        )
    assert upload_response.status_code == 200, f"Status inesperado al subir archivo: {upload_response.status_code}, body: {upload_response.text}"
    file_id = upload_response.json()["file_id"]

    # Probar con varios headers
    headers = ["ORIGEN", "ID", "TIPO"]
    response = client.post(f"/set_headers_to_keep/{file_id}", json={"headers": headers})
    assert response.status_code == 200, f"Status inesperado al setear headers: {response.status_code}, body: {response.text}"
    data = response.json()
    assert "unique_values" in data, f"No se encontró 'unique_values' en la respuesta: {data}"
    assert set(data["unique_values"]) == set(headers), f"Valores únicos inesperados: {data['unique_values']}\nEsperados: {set(headers)}"
    # Comentario: Si este test falla, revisar el endpoint y la lógica de retorno de headers.
