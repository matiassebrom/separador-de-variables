import time
import pandas as pd
import streamlit as st
from utils.fileio import build_zip_per_group

def stage_generate() -> bool:
    """
    7) Generar ZIP descargable con un Excel por valor.
    - Aplica todos los filtros definidos.
    - Agrega sufijos (1), (2)... si hay nombres repetidos dentro del ZIP.
    """
    df = st.session_state.df
    sep = st.session_state.separate_by
    keep = st.session_state.keep_cols
    base = st.session_state.base_name
    filters = st.session_state.filters


    # Validaciones duras
    if df is None:
        st.warning("Falta el archivo (etapa 1).")
        return False
    if not sep:
        st.warning("Falta 'Separar por' (etapa 3).")
        return False
    if not keep:
        st.warning("Faltan 'Datos a guardar' (etapa 5).")
        return False
    if not base:
        st.warning("Falta 'Guardar como (base)' (etapa 6).")
        return False


    # Mostrar resumen
    st.write(f"**Separar por:** {sep}")
    # Preprocesar work para mostrar valores de filtros
    work = df.copy()
    if filters:
        for col, vals in filters.items():
            if vals:
                work = work[work[col].astype(str).isin(vals)]
    if filters:
        st.write("**Filtros:**")
        for k, v in filters.items():
            all_vals = df[k].dropna().astype(str).unique().tolist()
            included = v
            excluded = [val for val in all_vals if val not in v]
            st.write(f"**{k}**")
            st.write(f"Incluidos: {', '.join(map(str, included))}")
            if excluded:
                st.write(f"Excluidos: {', '.join(map(str, excluded))}")
    else:
        st.write("**Filtros:** (ninguno)")
    st.write(f"**Columnas a guardar:**")
    st.write(f"{', '.join(keep)}")
    st.write(f"**Base de nombre:** {base}")

    # Previsualizar archivos a generar y permitir excluir
    work = df.copy()
    if filters:
        for col, vals in filters.items():
            if vals:
                work = work[work[col].astype(str).isin(vals)]
    if work.empty:
        st.warning("No hay filas que cumplan con los filtros seleccionados.")
        return False
    real_keep = [c for c in keep if c in work.columns]
    if not real_keep:
        st.warning("No se encontraron columnas válidas para exportar.")
        return False
    unique_vals = work[sep].dropna().astype(str).unique().tolist()
    unique_vals.sort()
    # Generar nombres de archivos
    file_names = []
    for val in unique_vals:
        tag = "(VACIO)" if val.strip() == "" else str(val)
        fname = f"{base} - {sep} - {tag}.xlsx"
        file_names.append(fname)
    st.info(f"Se generarán {len(file_names)} archivos:")
    st.caption("(Seleccione 🚫 si desea excluir alguno)")
    if "_exclude_files" not in st.session_state:
        st.session_state["_exclude_files"] = set()
    
    exclude_files = st.session_state["_exclude_files"].copy()
    
    for i, fname in enumerate(file_names):
        is_excluded = fname in exclude_files
        col1, col2 = st.columns([0.08, 0.92])
        with col1:
            button_key = f"excl_btn_{i}_{fname[:20]}"  # Key único con índice
            if st.button("🚫" if not is_excluded else "✅", key=button_key):
                if not is_excluded:
                    exclude_files.add(fname)
                else:
                    exclude_files.discard(fname)
                st.session_state["_exclude_files"] = exclude_files
                st.rerun()
        with col2:
            if is_excluded:
                st.markdown(f"~~{fname}~~")
            else:
                st.markdown(fname)
    
    exclude = list(exclude_files)

    if st.button("Generar y descargar", type="primary"):
        with st.spinner("Generando archivos..."):
            time.sleep(0.15)

            # Excluir archivos seleccionados
            excl_vals = set()
            for fname, val in zip(file_names, unique_vals):
                if fname in exclude:
                    excl_vals.add(val)
            filtered_work = work[~work[sep].astype(str).isin(excl_vals)]

            if filtered_work.empty:
                st.warning("No hay archivos para generar después de excluir.")
                return False

            # Generar ZIP en memoria solo con los seleccionados
            mem_zip, count = build_zip_per_group(
                df=filtered_work,
                separate_by=sep,
                keep_cols=real_keep,
                base_name=base
            )
            if count == 0:
                st.warning("No se generó ningún archivo (¿grupos vacíos?).")
                return False

            st.success(f"¡Listo! Generados {count} archivo(s).")
            st.download_button(
                label="⬇️ Descargar ZIP",
                data=mem_zip,
                file_name=f"{base}__split.zip",
                mime="application/zip",
            )
            return True

    return False
