# Separador de Archivos

## 🚀 Cómo ejecutar el backend (FastAPI)

1. **Instala las dependencias** (solo la primera vez):

    ```sh
    pip install -r backend/requirements.txt
    ```

2. **Ejecuta el backend**:

    - En Windows, desde la consola (cmd o PowerShell):

        ```sh
        .\run_backend.bat
        ```

    Esto iniciará el servidor FastAPI en modo desarrollo (con recarga automática) en:

    [http://127.0.0.1:8000](http://127.0.0.1:8000)

3. **Probar el endpoint**:

    Abre tu navegador y visita:

    - [http://127.0.0.1:8000](http://127.0.0.1:8000) — Hola mundo JSON
    - [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) — Documentación interactiva Swagger

---

**Nota:** El backend está en `backend/` y el código legacy en `backend/legacy/`.
