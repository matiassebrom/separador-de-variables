import time
import streamlit as st

MAX_UNIQUES = 20  # regla: si supera esto, se cancela

def stage_filters() -> bool:
    """
    3) Configurar filtros (opcional).
    - Elegís una columna; recién ahí se calculan sus valores únicos.
    - Si hay > MAX_UNIQUES, se cancela y avisa.
    - Podés agregar múltiples filtros (dict col -> list(vals)).
    """
    if st.session_state.df is None or not st.session_state.columns:
        st.warning("Necesitás completar las etapas 1 y 2 primero.")
        return False

    st.write("Podés agregar uno o más filtros. Si no querés filtrar, simplemente Continuar en la siguiente pantalla.")

    # Inicializar el valor de columna seleccionada
    st.session_state.setdefault("filter_column", "(ninguna)")

    # Selectbox para columna a filtrar, con key estable
    st.selectbox(
        "Columna a filtrar",
        options=["(ninguna)"] + st.session_state.columns,
        key="filter_column"
    )
    col = st.session_state.filter_column

    # Si hay columna seleccionada y no es "(ninguna)"
    if col and col != "(ninguna)":
        # Cachear los valores únicos por columna
        cache_key = f"_filter_cache_{col}"
        if cache_key not in st.session_state:
            uniques = st.session_state.df[col].dropna().astype(str).unique().tolist()
            uniques.sort()
            st.session_state[cache_key] = uniques

        options = st.session_state[cache_key]
        if len(options) > MAX_UNIQUES:
            st.error(f"La columna '{col}' tiene {len(options)} valores distintos (> {MAX_UNIQUES}). Elegí otra columna.")
            st.session_state[f"filter_vals__{col}"] = []
        else:
            # Inicializar la selección de valores para la columna si no existe
            st.session_state.setdefault(f"filter_vals__{col}", [])

            # Multiselect con key estable, sin default dinámico
            st.multiselect(
                "Valores permitidos",
                options=options,
                key=f"filter_vals__{col}"
            )
            vals = st.session_state[f"filter_vals__{col}"]

            # Guardar el filtro automáticamente al seleccionar valores
            if vals:
                current = st.session_state.filters.copy()
                current[col] = vals
                st.session_state.filters = current
            elif col in st.session_state.filters:
                # Si se deseleccionan todos, quitar el filtro
                current = st.session_state.filters.copy()
                current.pop(col)
                st.session_state.filters = current

    # Opción para limpiar todos
    if st.session_state.filters:
        if st.button("Limpiar todos los filtros"):
            st.session_state.filters = {}
            st.info("Filtros eliminados.")

    # Nada bloquea continuar: filtros son opcionales
    return True
