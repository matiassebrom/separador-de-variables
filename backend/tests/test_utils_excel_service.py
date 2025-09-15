import os
import tempfile
import pytest
from backend.services.excel_service import cleanup_file, get_zip_base_name, file_store

def test_cleanup_file_removes_file():
    # Crear archivo temporal
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        path = tmp.name
        tmp.write(b"test")
    assert os.path.exists(path)
    cleanup_file(path)
    assert not os.path.exists(path)

def test_cleanup_file_no_error_on_missing():
    # No debe lanzar excepción si el archivo no existe
    path = "no_existe_123456.tmp"
    cleanup_file(path)  # No debe lanzar

def test_get_zip_base_name_with_base_name():
    file_id = "test1"
    file_store[file_id] = {"base_name": "mi_zip"}
    assert get_zip_base_name(file_id) == "mi_zip"

def test_get_zip_base_name_with_filename():
    file_id = "test2"
    file_store[file_id] = {"filename": "archivo.xlsx"}
    assert get_zip_base_name(file_id) == "archivo"

def test_get_zip_base_name_default():
    file_id = "test3"
    file_store[file_id] = {}
    assert get_zip_base_name(file_id).startswith("archivos_")
