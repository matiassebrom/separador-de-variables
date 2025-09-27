import os
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_download_split_excels():
    # Subir archivo de prueba
    test_file_path = os.path.join(os.path.dirname(__file__), "excel para test.xlsx")
    with open(test_file_path, "rb") as f:
        upload_response = client.post(
            "/upload_file",
            files={"file": ("excel para test.xlsx", f, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
        )
    assert upload_response.status_code == 200
    file_id = upload_response.json()["file_id"]

    # Configurar columnas a dividir
    split_response = client.post(f"/set_headers_to_split/{file_id}", json={"headers": ["ORIGEN", "ETAPA"]})
    assert split_response.status_code == 200

    # Configurar columnas a mantener
    keep_response = client.post(f"/set_headers_to_keep/{file_id}", json={"headers": ["ID"]})
    assert keep_response.status_code == 200

    # Configurar nombre base para la descarga
    base_name_response = client.post(f"/set_base_name/{file_id}", json={"base_name": "test_base"})
    assert base_name_response.status_code == 200

    # Descargar el ZIP generado
    download_response = client.get(f"/download_files/{file_id}")
    if download_response.status_code != 200:
        print(f"Error en descarga: {download_response.status_code}, body: {download_response.text}")
    assert download_response.status_code == 200
    assert download_response.headers["content-type"] == "application/zip"
    assert download_response.content  # El contenido debe existir

    # Validar el contenido del ZIP: debe tener un archivo por cada columna a separar
    import zipfile
    import io
    zip_bytes = io.BytesIO(download_response.content)
    with zipfile.ZipFile(zip_bytes, 'r') as zipf:
        zip_names = zipf.namelist()
        # Debe haber un archivo por cada columna a separar
        assert len(zip_names) == 2, f"Se esperaban 2 archivos en el ZIP, pero se encontraron: {zip_names}"
        # Los nombres deben ser correctos
        assert any("test_base ORIGEN.xlsx" in name for name in zip_names), f"No se encontró archivo para ORIGEN: {zip_names}"
        assert any("test_base ETAPA.xlsx" in name for name in zip_names), f"No se encontró archivo para ETAPA: {zip_names}"
