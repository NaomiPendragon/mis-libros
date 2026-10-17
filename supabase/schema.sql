-- =============================================================================
-- Mis libros — ejercicio de calentamiento
-- Pegar en Supabase → SQL Editor → New query → Run
-- =============================================================================

-- Pila de libros pendientes de cada usuario
CREATE TABLE pendiente (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    -- Por defecto toma el usuario que tiene la sesión abierta
    usuario_id  uuid NOT NULL DEFAULT auth.uid()
                REFERENCES auth.users (id) ON DELETE CASCADE,
    titulo      text NOT NULL CHECK (length(trim(titulo)) > 0),
    autor       text,
    estado      text NOT NULL DEFAULT 'quiero_leer'
                CHECK (estado IN ('quiero_leer', 'leyendo', 'leido', 'abandonado')),
    creado      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX pendiente_usuario_idx ON pendiente (usuario_id);

-- Sin RLS, cualquiera con la llave anon podría leer o borrar todo.
-- Con esta política cada usuario solo ve y toca sus propios libros.
ALTER TABLE pendiente ENABLE ROW LEVEL SECURITY;

CREATE POLICY gestiona_propio ON pendiente FOR ALL TO authenticated
    USING (usuario_id = (SELECT auth.uid()))
    WITH CHECK (usuario_id = (SELECT auth.uid()));
