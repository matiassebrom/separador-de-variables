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
    assert upload_response.status_code == 200
    file_id = upload_response.json()["file_id"]

    # Probar set_headers_to_keep
    response = client.post(f"/set_headers_to_keep/{file_id}", json={"headers": ["ORIGEN"]})
    assert response.status_code == 200
    data = response.json()
    assert "headers" in data
    assert set(data["headers"]) == {"ORIGEN"}
