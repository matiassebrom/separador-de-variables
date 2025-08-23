import os
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_download_files():
    # Usar el archivo Excel fijo para los tests
    test_file_path = os.path.join(os.path.dirname(__file__), "excel para test.xlsx")
    with open(test_file_path, "rb") as f:
        upload_response = client.post(
            "/upload_file",
            files={"file": ("excel para test.xlsx", f, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
        )
    assert upload_response.status_code == 200
    file_id = upload_response.json()["file_id"]

    # Setear header para dividir
    response = client.post(f"/set_header_to_split/{file_id}", json={"header": "ORIGEN"})
    assert response.status_code == 200
    unique_values = response.json()["unique_values_in_header_to_split"]

    # Setear columnas a mantener
    response = client.post(f"/set_headers_to_keep/{file_id}", json={"headers": ["ORIGEN", "ID"]})
    assert response.status_code == 200

    # Setear valores a mantener para el header
    values_to_keep = [v for v in unique_values if v in ("GURUS", "TAP")]
    response = client.post(f"/set_values_to_keep_by_header/{file_id}", json={"header": "ORIGEN", "values": values_to_keep})
    assert response.status_code == 200

    # Descargar el zip
    response = client.get(f"/download_files/{file_id}")
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/zip"
    assert response.content  # El contenido debe existir
