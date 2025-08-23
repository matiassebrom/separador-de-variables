import os
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_get_unique_values():
    # Usar el archivo Excel fijo para los tests
    test_file_path = os.path.join(os.path.dirname(__file__), "excel para test.xlsx")
    with open(test_file_path, "rb") as f:
        upload_response = client.post(
            "/upload_file",
            files={"file": ("excel para test.xlsx", f, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
        )
    assert upload_response.status_code == 200
    file_id = upload_response.json()["file_id"]

    # Cambia 'col1' por el nombre real de la columna que quieras testear
    header = "ORIGEN"
    unique_response = client.get(f"/get_unique_values/{file_id}/{header}")
    assert unique_response.status_code == 200
    data = unique_response.json()
    assert "unique_values" in data
    # Verifica los valores únicos esperados según el archivo de test
    assert set(data["unique_values"]) == {"ORIGEN", "GURUS", "OPI", "TAP"}
