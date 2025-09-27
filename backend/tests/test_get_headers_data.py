import os
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_get_headers_data():
    # Usar el archivo Excel fijo para los tests
    test_file_path = os.path.join(os.path.dirname(__file__), "excel para test.xlsx")
    with open(test_file_path, "rb") as f:
        upload_response = client.post(
            "/upload_file",
            files={"file": ("excel para test.xlsx", f, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
        )

    assert upload_response.status_code == 200, f"Status inesperado al subir archivo: {upload_response.status_code}, body: {upload_response.text}"
    file_id = upload_response.json()["file_id"]

    # Probar el nuevo endpoint
    response = client.get(f"/get_headers_data/{file_id}")
    assert response.status_code == 200, f"Status inesperado al obtener datos de headers: {response.status_code}, body: {response.text}"
    data = response.json()

    # Verifica que la respuesta tenga la clave 'headers_data' y sea una lista
    assert "headers_data" in data, f"La respuesta no contiene 'headers_data': {data}"
    assert isinstance(data["headers_data"], list), f"'headers_data' no es una lista: {data}"
    for col in data["headers_data"]:
        assert "header" in col, f"Falta 'header' en {col}"
        assert "total_count" in col, f"Falta 'total_count' en {col}"
        assert "unique_count" in col, f"Falta 'unique_count' en {col}"

    # Comentario: Si este test falla, revisar el endpoint /get_headers_data/{file_id} y los datos del archivo de test.
