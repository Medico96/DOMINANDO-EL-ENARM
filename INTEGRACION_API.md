# 📚 Guía de Integración - Dominio ENARM

## 🎯 Paso a Paso para Conectar tu Base de Datos

### Paso 1: Usar el Servicio de Preguntas

En tu `src/App.tsx`, reemplaza la sección donde cargas las preguntas:

#### Busca esto (alrededor de línea 70):
```typescript
useEffect(() => {
  // TODO: Aquí conectarías tu API/BD real
  // const fetchQuestions = async () => {
  setQuestions(mockQuestions.slice(0, questionsCount));
}, [questionsCount, selectedSpecialty]);
```

#### Reemplázalo con:
```typescript
useEffect(() => {
  const loadQuestions = async () => {
    try {
      const data = await fetchQuestions({
        especialidad: selectedSpecialty,
        limit: questionsCount
      });
      setQuestions(data);
    } catch (error) {
      console.error('Error loading questions:', error);
      // Fallback a preguntas de prueba si falla
      setQuestions(mockQuestions.slice(0, questionsCount));
    }
  };
  
  loadQuestions();
}, [questionsCount, selectedSpecialty]);
```

#### Agrega el import al inicio del archivo:
```typescript
import { fetchQuestions } from './services/questionService';
```

---

### Paso 2: Configurar Variables de Entorno

1. **Copia el archivo de ejemplo:**
```bash
cp .env.example .env.local
```

2. **Para Supabase** (recomendado - es lo que usas en tu proyecto original):
```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

Para obtener estas credenciales:
- Ve a [Supabase Console](https://app.supabase.com)
- Selecciona tu proyecto
- Ve a Settings → API
- Copia `Project URL` y `Anon Public Key`

3. **Para API REST personalizada:**
```
VITE_API_URL=https://tu-api.com/api
```

---

### Paso 3: Preparar tu Base de Datos

#### Si usas Supabase:

**Crea la tabla `preguntas`:**

```sql
-- Crear tabla de preguntas
create table preguntas (
  id bigint primary key generated always as identity,
  pregunta text not null,
  opcionA text not null,
  opcionB text not null,
  opcionC text not null,
  opcionD text not null,
  respuesta_correcta varchar(1) not null check (respuesta_correcta in ('A', 'B', 'C', 'D')),
  especialidad varchar(100),
  materia varchar(100),
  explicacion text,
  dificultad varchar(20), -- opcional: 'baja', 'media', 'alta'
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Crear índices para búsquedas rápidas
create index idx_especialidad on preguntas(especialidad);
create index idx_materia on preguntas(materia);

-- Habilitar RLS (Row Level Security) si quieres controlar acceso
alter table preguntas enable row level security;

-- Permitir lectura pública
create policy "Preguntas are readable by anyone" on preguntas
  for select using (true);
```

**Insertar preguntas de ejemplo:**

```sql
insert into preguntas (pregunta, opcionA, opcionB, opcionC, opcionD, respuesta_correcta, especialidad, materia, explicacion)
values 
(
  '¿Cuál es el fármaco de primera línea para la hipertensión arterial esencial?',
  'Hidralazina',
  'Bloqueador de canales de calcio',
  'Inhibidor de la ECA',
  'Diurético tiazídico',
  'C',
  'Cardiología',
  'Farmacología',
  'Los inhibidores de la ECA son considerados de primera línea en hipertensión esencial según GPC 2026.'
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
  'El signo de Kernig es patognomónico de irritación meníngea.'
);
```

---

### Paso 4: Crear tabla de respuestas del usuario (Opcional)

Si quieres guardar el historial de respuestas:

```sql
create table respuestas_usuario (
  id bigint primary key generated always as identity,
  usuario_id uuid references auth.users(id),
  pregunta_id bigint references preguntas(id),
  respuesta varchar(1) not null,
  es_correcta boolean not null,
  tiempo_respuesta int, -- en segundos
  created_at timestamp default now()
);

create index idx_usuario_respuestas on respuestas_usuario(usuario_id);
```

---

### Paso 5: Guardar Respuestas (Opcional)

En tu componente principal, después de que el usuario responda:

```typescript
import { saveUserAnswer } from './services/questionService';

// Cuando el usuario selecciona una respuesta:
const handleAnswerSelect = async (option: string) => {
  const currentQuestion = questions[simulatorState.currentQuestion];
  const isCorrect = option === currentQuestion.respuesta_correcta;
  
  // Guardar en BD
  if (user?.id) {
    await saveUserAnswer(
      user.id,
      currentQuestion.id,
      option,
      isCorrect
    );
  }
  
  // Resto de tu lógica...
  setSimulatorState(prev => ({
    ...prev,
    answers: {
      ...prev.answers,
      [prev.currentQuestion]: option,
    },
  }));
};
```

---

### Paso 6: Testing Local

```bash
# 1. Instalar dependencias
npm install

# 2. Crear .env.local con tus credenciales
cp .env.example .env.local
# Editar .env.local con datos reales

# 3. Ejecutar en desarrollo
npm run dev

# 4. Abrir http://localhost:5173
```

---

## 🔄 Flujo de Datos

```
┌─────────────────────────────────────────────────┐
│          SIMULADOR ENARM                        │
└────────────────┬────────────────────────────────┘
                 │
        ┌────────▼────────┐
        │  App.tsx        │
        │  (Estado)       │
        └────────┬────────┘
                 │
        ┌────────▼──────────────────┐
        │ fetchQuestions()          │
        │ (questionService.ts)      │
        └────────┬──────────────────┘
                 │
        ┌────────▼──────────────────────────┐
        │  ¿Variables de entorno?           │
        ├────────────────────────────────────┤
        │ SUPABASE → Supabase              │
        │ API_URL  → API REST              │
        │ Default  → Mock Data             │
        └────────┬──────────────────────────┘
                 │
        ┌────────▼──────────────────┐
        │  Base de Datos            │
        │  (Supabase/Firebase/API)  │
        └───────────────────────────┘
```

---

## 🚨 Solución de Problemas

### Error: "VITE_SUPABASE_URL is not defined"

**Solución:**
1. Verifica que existe `.env.local` en la raíz del proyecto
2. Verifica que tiene las variables correctas
3. Reinicia el servidor (`npm run dev`)

### Error: "CORS error"

**Si usas API REST:**
1. Asegúrate que tu API permita CORS desde localhost
2. Prueba con un header `Access-Control-Allow-Origin: *`

**Para desarrollo local:**
```javascript
// En tu API backend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Preguntas no cargan

1. Verifica que tu tabla existe: `SELECT COUNT(*) FROM preguntas;`
2. Verifica RLS está permitida en Supabase
3. Usa las dev tools (F12) → Console para ver errores exactos
4. Revisa Network tab para ver la solicitud

---

## 📊 Estructura de Datos Final

```typescript
interface Question {
  id: number;
  pregunta: string;           // Texto de la pregunta
  opcionA: string;            // Opción A
  opcionB: string;            // Opción B
  opcionC: string;            // Opción C
  opcionD: string;            // Opción D
  respuesta_correcta: string; // A, B, C o D
  especialidad: string;       // Cardiología, Neurología, etc.
  materia: string;            // Farmacología, Semiología, etc.
  explicacion?: string;       // Explicación de la respuesta
}
```

---

## 🎨 Personalización Avanzada

### Agregar más campos a preguntas

1. En tu BD, agrega la columna:
```sql
alter table preguntas add column dificultad varchar(20);
alter table preguntas add column año_enarm int;
```

2. Actualiza la interface en TypeScript:
```typescript
interface Question {
  // ... campos existentes
  dificultad?: 'baja' | 'media' | 'alta';
  año_enarm?: number;
}
```

3. Úsalos en el componente:
```typescript
<div className="text-sm text-gray-600">
  Dificultad: {question.dificultad?.toUpperCase()}
  {question.año_enarm && ` | ENARM ${question.año_enarm}`}
</div>
```

---

## 🚀 Desplegar en Producción

### Vercel (Recomendado)

```bash
# 1. Push a GitHub
git push origin main

# 2. Ve a vercel.com → New Project
# 3. Selecciona tu repositorio
# 4. En "Environment Variables", agrega:
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...

# 5. Deploy!
```

### Netlify

```bash
# 1. npm run build
# 2. Arrastra la carpeta 'dist/' a netlify.app
# O conecta tu repo en settings
```

### Tu servidor propio

```bash
# 1. Build
npm run build

# 2. Sube carpeta dist/ a tu servidor
# 3. Configura el servidor para servir dist/index.html
```

---

## ✅ Checklist Final

- [ ] Archivo `.env.local` creado con credenciales
- [ ] Tabla `preguntas` existe en BD
- [ ] Al menos 10 preguntas cargadas
- [ ] `npm run dev` funciona sin errores
- [ ] Preguntas cargan desde BD (no mock data)
- [ ] Respuestas se registran (si implementaste)
- [ ] `npm run build` completa exitosamente
- [ ] Proyecto desplegado en producción

---

¡Listo! Tu simulador ENARM profesional está totalmente integrado. 🎯
