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
    assert upload_response.status_code == 200
    file_id = upload_response.json()["file_id"]

    # Probar set_header_to_split
    response = client.post(f"/set_header_to_split/{file_id}", json={"header": "ORIGEN"})
    assert response.status_code == 200
    data = response.json()
    assert "unique_values_in_header_to_split" in data
    assert set(data["unique_values_in_header_to_split"]) == {"ORIGEN", "GURUS", "OPI", "TAP"}
