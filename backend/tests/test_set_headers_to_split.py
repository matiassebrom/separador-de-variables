import os
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_set_headers_to_split():
    # Usar el archivo Excel fijo para los tests
    test_file_path = os.path.join(os.path.dirname(__file__), "excel para test.xlsx")
    with open(test_file_path, "rb") as f:
        upload_response = client.post(
            "/upload_file",
            files={"file": ("excel para test.xlsx", f, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
        )

    assert upload_response.status_code == 200, f"Status inesperado al subir archivo: {upload_response.status_code}, body: {upload_response.text}"
    file_id = upload_response.json()["file_id"]

    # Probar set_headers_to_split con varios headers
    headers_to_split = ["ORIGEN", "DESTINO"]
    response = client.post(f"/set_headers_to_split/{file_id}", json={"headers": headers_to_split})
    assert response.status_code == 200, f"Status inesperado al setear headers: {response.status_code}, body: {response.text}"
    data = response.json()

    # Verifica que la clave esté en la respuesta
    assert "count_headers_to_split" in data, f"No se encontró 'count_headers_to_split' en la respuesta: {data}"
    # Verifica que el valor sea igual a la cantidad de headers enviados
    assert data["count_headers_to_split"] == len(headers_to_split)
