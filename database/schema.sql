-- ========================================
-- DOMINIO ENARM - Database Schema
-- ========================================

-- Tabla principal de preguntas
CREATE TABLE IF NOT EXISTS preguntas (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  pregunta TEXT NOT NULL,
  opcionA TEXT NOT NULL,
  opcionB TEXT NOT NULL,
  opcionC TEXT NOT NULL,
  opcionD TEXT NOT NULL,
  respuesta_correcta VARCHAR(1) NOT NULL CHECK (respuesta_correcta IN ('A', 'B', 'C', 'D')),
  especialidad VARCHAR(100) NOT NULL,
  materia VARCHAR(100),
  explicacion TEXT,
  dificultad VARCHAR(20) DEFAULT 'media', -- baja, media, alta
  año_enarm INTEGER, -- Año del ENARM original
  fuente VARCHAR(100), -- Fuente de la pregunta
  tags TEXT, -- JSON array con etiquetas
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_preguntas_especialidad ON preguntas(especialidad);
CREATE INDEX IF NOT EXISTS idx_preguntas_materia ON preguntas(materia);
CREATE INDEX IF NOT EXISTS idx_preguntas_dificultad ON preguntas(dificultad);
CREATE INDEX IF NOT EXISTS idx_preguntas_año ON preguntas(año_enarm);

-- Tabla para guardar respuestas de usuarios (opcional)
CREATE TABLE IF NOT EXISTS respuestas_usuario (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pregunta_id BIGINT REFERENCES preguntas(id) ON DELETE CASCADE,
  respuesta VARCHAR(1) NOT NULL CHECK (respuesta IN ('A', 'B', 'C', 'D')),
  es_correcta BOOLEAN NOT NULL,
  tiempo_respuesta INTEGER, -- en segundos
  simulador_id UUID, -- ID del simulador/sesión
  created_at TIMESTAMP DEFAULT now()
);

-- Índices para respuestas
CREATE INDEX IF NOT EXISTS idx_respuestas_usuario ON respuestas_usuario(usuario_id);
CREATE INDEX IF NOT EXISTS idx_respuestas_pregunta ON respuestas_usuario(pregunta_id);
CREATE INDEX IF NOT EXISTS idx_respuestas_simulador ON respuestas_usuario(simulador_id);

-- Tabla para sesiones de simulador (opcional)
CREATE TABLE IF NOT EXISTS simuladores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  especialidad_filtrada VARCHAR(100),
  total_preguntas INTEGER,
  preguntas_respondidas INTEGER,
  preguntas_correctas INTEGER,
  porcentaje_final NUMERIC(5,2),
  tiempo_total INTEGER, -- en segundos
  fecha_inicio TIMESTAMP DEFAULT now(),
  fecha_fin TIMESTAMP,
  estado VARCHAR(20) DEFAULT 'en_progreso' -- en_progreso, completado, abandonado
);

-- Índices para simuladores
CREATE INDEX IF NOT EXISTS idx_simuladores_usuario ON simuladores(usuario_id);
CREATE INDEX IF NOT EXISTS idx_simuladores_fecha ON simuladores(fecha_inicio);

-- Habilitar RLS (Row Level Security)
ALTER TABLE preguntas ENABLE ROW LEVEL SECURITY;
ALTER TABLE respuestas_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE simuladores ENABLE ROW LEVEL SECURITY;

-- Políticas RLS - Preguntas (lectura pública)
CREATE POLICY "Preguntas are readable by anyone" ON preguntas
  FOR SELECT USING (true);

-- Políticas RLS - Respuestas (solo el usuario puede ver sus respuestas)
CREATE POLICY "Users can see their own responses" ON respuestas_usuario
  FOR SELECT USING (auth.uid() = usuario_id);

CREATE POLICY "Users can insert their own responses" ON respuestas_usuario
  FOR INSERT WITH CHECK (auth.uid() = usuario_id);

-- Políticas RLS - Simuladores (solo el usuario puede ver sus simuladores)
CREATE POLICY "Users can see their own simulators" ON simuladores
  FOR SELECT USING (auth.uid() = usuario_id);

CREATE POLICY "Users can create simulators" ON simuladores
  FOR INSERT WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can update their own simulators" ON simuladores
  FOR UPDATE USING (auth.uid() = usuario_id);

-- ========================================
-- DATOS DE PRUEBA
-- ========================================

INSERT INTO preguntas (pregunta, opcionA, opcionB, opcionC, opcionD, respuesta_correcta, especialidad, materia, explicacion, dificultad)
VALUES
(
  '¿Cuál es el fármaco de primera línea para la hipertensión arterial esencial?',
  'Hidralazina',
  'Bloqueador de canales de calcio',
  'Inhibidor de la ECA',
  'Diurético tiazídico',
  'C',
  'Cardiología',
  'Farmacología',
  'Los inhibidores de la ECA son considerados de primera línea en hipertensión esencial según GPC 2026.',
  'media'
),
(
  '¿Cuál es el signo de Kernig en meningitis?',
  'Rigidez de nuca',
  'Imposibilidad de extender la pierna cuando se flexiona la cadera',
  'Reflejo de Babinski presente',
  'Ptosis palpebral',
  'B',
  'Neurología',
  'Semiología',
  'El signo de Kernig es patognomónico de irritación meníngea.',
  'media'
),
(
  '¿Cuál es la causa más frecuente de insuficiencia renal aguda en México?',
  'Glomerulonefritis',
  'Hipovolemia/Hipotensión',
  'Obstrucción ureteral',
  'Nefrotoxicidad por medicamentos',
  'B',
  'Nefrología',
  'Patología',
  'La hipovolemia es la causa más común de IRA prerrenal en la práctica clínica mexicana.',
  'media'
),
(
  '¿Cuál es la complicación más frecuente de la diabetes tipo 2?',
  'Cetoacidosis diabética',
  'Retinopatía diabética',
  'Neuropatía diabética',
  'Nefropatía diabética',
  'C',
  'Endocrinología',
  'Complicaciones',
  'La neuropatía diabética es la complicación más frecuente en pacientes con diabetes tipo 2.',
  'baja'
),
(
  '¿Cuál es el tratamiento inicial de la apendicitis aguda?',
  'Antibióticos y observación',
  'Apendicectomía de emergencia',
  'Drenaje percutáneo',
  'Enema evacuante',
  'B',
  'Cirugía',
  'Abdomen Agudo',
  'La apendicectomía es el tratamiento definitivo de la apendicitis aguda.',
  'baja'
);

-- Visualizar las preguntas insertadas
SELECT COUNT(*) as total_preguntas FROM preguntas;
SELECT COUNT(*) as especialidades FROM (SELECT DISTINCT especialidad FROM preguntas) AS e;
