import os
from fastapi.testclient import TestClient
from backend.main import app

def test_get_unique_values_by_header_endpoint():
    client = TestClient(app)
    test_file_path = os.path.join(os.path.dirname(__file__), "excel para test.xlsx")
    with open(test_file_path, "rb") as f:
        upload_response = client.post(
            "/upload_file",
            files={"file": ("excel para test.xlsx", f, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
        )
    assert upload_response.status_code == 200
    file_id = upload_response.json()["file_id"]

    # Probar endpoint get_unique_values
    response = client.post(f"/get_unique_values/{file_id}", json={"header": "ORIGEN"})
    assert response.status_code == 200
    data = response.json()
    assert "unique_values" in data
    expected = {"ORIGEN", "GURUS", "OPI", "TAP"}
    assert set(data["unique_values"]) == expected
