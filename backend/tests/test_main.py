from fastapi.testclient import TestClient
from backend.main import app

import pytest

def test_read_root():
    client = TestClient(app)
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "¡Hola mundo desde FastAPI!"}
