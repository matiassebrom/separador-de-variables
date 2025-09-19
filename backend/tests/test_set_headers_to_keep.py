
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

    assert upload_response.status_code == 200, f"Status inesperado al subir archivo: {upload_response.status_code}, body: {upload_response.text}"
    file_id = upload_response.json()["file_id"]

    # Probar el nuevo endpoint con varios headers
    headers_to_keep = ["StartDate", "ORIGEN", "ID"]
    response = client.post(f"/set_headers_to_keep/{file_id}", json={"headers": headers_to_keep})
    assert response.status_code == 200, f"Status inesperado: {response.status_code}, body: {response.text}"
    data = response.json()
    assert "headers_kept" in data, f"No se encontró 'headers_kept' en la respuesta: {data}"
    assert set(data["headers_kept"]) == set(headers_to_keep), f"Headers guardados inesperados: {data['headers_kept']}"
    # Comentario: Si este test falla, revisar el endpoint y la lógica de retorno de headers.
import os
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)
