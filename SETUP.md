# Dominio ENARM - Simulador Inteligente

## 🚀 Interfaz Profesional Implementada

Tu proyecto ahora tiene una interfaz moderna y profesional tipo los simuladores profesionales (enarmsimulador.com, gliamediq.web.app, retoenarm.com).

### ✨ Características Incluidas

1. **Header Profesional** - Logo, navegación y branding
2. **Panel Lateral de Filtros**
   - Seleccionar especialidades
   - Ajustar cantidad de preguntas (10, 20, 50, 100, 280)
   - Estadísticas generales

3. **Interfaz de Preguntas**
   - Pregunta con contexto clínico
   - 4 opciones de respuesta (A, B, C, D)
   - Indicador de progreso (barra y porcentaje)
   - Información de especialidad y materia

4. **Panel de Estadísticas en Tiempo Real**
   - Timer/cronómetro (6 horas)
   - Respuestas correctas
   - Respuestas incorrectas
   - Respuestas omitidas
   - Desempeño actual en %

5. **Navegación de Preguntas**
   - Grid de 5 columnas con todas las preguntas
   - Indicadores visuales (respondida, sin responder, omitida)
   - Saltar entre preguntas

6. **Pantalla de Resultados**
   - Calificación final en porcentaje
   - Banner con mensaje motivacional
   - Análisis detallado de desempeño
   - Gráficos de barras
   - Revisión pregunta por pregunta
   - Botones para descargar reporte o intentar de nuevo

## 🔧 Cómo Conectar Tu Base de Datos

### Opción 1: Supabase (Recomendado - Como tu proyecto original)

En `src/App.tsx`, busca esta sección (línea ~70):

```typescript
// TODO: Aquí conectarías tu API/BD real
// const fetchQuestions = async () => {
//   try {
//     const response = await axios.get('/api/questions', {
//       params: { especialidad: selectedSpecialty, limit: questionsCount }
//     });
//     setQuestions(response.data);
//   } catch (error) {
//     console.error('Error fetching questions:', error);
//   }
// };
```

Reemplázalo con:

```typescript
const fetchQuestions = async () => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    const query = supabaseUrl + `/rest/v1/preguntas?select=*`;
    const params = new URLSearchParams();
    
    if (selectedSpecialty !== 'all') {
      params.append('especialidad', `eq.${selectedSpecialty}`);
    }
    params.append('limit', questionsCount.toString());
    
    const response = await fetch(`${query}&${params}`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    
    const data = await response.json();
    setQuestions(data);
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
};

fetchQuestions();
```

### Opción 2: API REST Personalizada

```typescript
const fetchQuestions = async () => {
  try {
    const response = await axios.get('https://tu-api.com/api/preguntas', {
      params: {
        especialidad: selectedSpecialty,
        limit: questionsCount
      }
    });
    setQuestions(response.data);
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
};

fetchQuestions();
```

### Opción 3: Firebase

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, limit, getDocs } from 'firebase/firestore';

const db = getFirestore();

const fetchQuestions = async () => {
  try {
    const q = selectedSpecialty === 'all'
      ? query(collection(db, 'preguntas'), limit(questionsCount))
      : query(
          collection(db, 'preguntas'),
          where('especialidad', '==', selectedSpecialty),
          limit(questionsCount)
        );
    
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setQuestions(data);
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
};

fetchQuestions();
```

## 📦 Instalar Supabase (si no lo tienes)

```bash
npm install @supabase/supabase-js
```

## 🔑 Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima
```

## 📋 Estructura de Datos Esperada

Tu tabla de preguntas debe tener estos campos:

```sql
CREATE TABLE preguntas (
  id BIGINT PRIMARY KEY,
  pregunta TEXT NOT NULL,
  opcionA TEXT NOT NULL,
  opcionB TEXT NOT NULL,
  opcionC TEXT NOT NULL,
  opcionD TEXT NOT NULL,
  respuesta_correcta VARCHAR(1) NOT NULL, -- A, B, C o D
  especialidad VARCHAR(100),
  materia VARCHAR(100),
  explicacion TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

## 🎨 Personalización

### Cambiar colores principales
Edita en `src/App.tsx` y componentes:
- `from-blue-600 to-blue-700` → Cambiar por tus colores

### Agregar más especialidades
En `src/components/SidePanel.tsx`, actualiza el array `specialties`

### Modificar cantidad de tiempo
En `src/App.tsx`, línea ~48:
```typescript
timeLeft: 3600, // Cambiar a segundos (360000 = 100 horas)
```

## 🚀 Desplegar

```bash
npm run build
# La carpeta dist/ está lista para desplegar en:
# - Vercel
# - Netlify
# - Firebase Hosting
# - GitHub Pages
# - Tu servidor personalizado
```

## 📞 Soporte

Si necesitas ajustes en:
- Conexión a base de datos
- Campos adicionales
- Funcionalidades nuevas
- Integración con tu API existente

Contacta para asistencia específica en tu caso de uso.

¡Tu simulador ENARM profesional está listo! 🎯
