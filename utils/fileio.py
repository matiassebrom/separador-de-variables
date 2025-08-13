import io
import re
import zipfile
from typing import Dict, List, Tuple

import pandas as pd

INVALID = r'[\\/:*?"<>|]'

def sanitize(s: str, max_len: int = 230) -> str:
    s = re.sub(INVALID, "", str(s)).strip()
    return s[:max_len]

def read_any(uploaded_file) -> pd.DataFrame:
    name = uploaded_file.name.lower()
    if name.endswith(".xlsx") or name.endswith(".xls"):
        return pd.read_excel(uploaded_file)
    # con pyarrow: pd.read_csv(uploaded_file, engine="pyarrow")
    return pd.read_csv(uploaded_file)

def to_excel_bytes(df: pd.DataFrame) -> bytes:
    bio = io.BytesIO()
    try:
        df.to_excel(bio, index=False, engine="xlsxwriter")
    except Exception:
        df.to_excel(bio, index=False)
    bio.seek(0)
    return bio.read()

def build_zip_per_group(
    df: pd.DataFrame,
    separate_by: str,
    keep_cols: List[str],
    base_name: str
) -> Tuple[io.BytesIO, int]:
    """
    Genera un ZIP en memoria con un .xlsx por cada valor único en `separate_by`.
    Si hay nombres duplicados dentro del lote, agrega sufijos (1), (2), ...
    Devuelve (zip_bytesio, cantidad_archivos).
    """
    mem = io.BytesIO()
    written = 0
    used_names: Dict[str, int] = {}

    with zipfile.ZipFile(mem, mode="w", compression=zipfile.ZIP_DEFLATED) as zf:
        for val, group in df.groupby(separate_by, dropna=False):
            tag = "(VACIO)" if pd.isna(val) or (isinstance(val, str) and val.strip() == "") else str(val)
            fname_base = f"{sanitize(base_name)} - {sanitize(separate_by)} - {sanitize(tag)}.xlsx"

            # resolver duplicados dentro del zip
            if fname_base not in used_names:
                final_name = fname_base
                used_names[fname_base] = 1
            else:
                used_names[fname_base] += 1
                n = used_names[fname_base]
                final_name = fname_base.replace(".xlsx", f" ({n}).xlsx")

            content = to_excel_bytes(group[keep_cols])
            zf.writestr(final_name, content)
            written += 1

    mem.seek(0)
    return mem, written
