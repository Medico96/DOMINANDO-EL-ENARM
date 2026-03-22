# 🏥 Dominio ENARM - Simulador Inteligente

**Simulador profesional para el ENARM (Examen Nacional para Aspirantes a Residencias Médicas)**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1-38B2AC?logo=tailwindcss)

---

## ✨ Características

### 🎯 Interfaz Profesional
- Diseño moderno y responsivo
- Panel lateral con filtros avanzados
- Visualización clara de preguntas
- Estadísticas en tiempo real
- Sistema de navegación intuitivo

### 📊 Funcionalidades Completas
- ✅ 280 preguntas basadas en **GPC 2026**
- ✅ 5 tipos de simuladores diferentes
- ✅ Timer/cronómetro (6 horas)
- ✅ Filtrado por especialidad
- ✅ Estadísticas detalladas de desempeño
- ✅ Análisis pregunta por pregunta
- ✅ Sistema de calificación
- ✅ Reporte descargable

### 🔗 Integraciones
- **Supabase** - Base de datos en la nube
- **Firebase** - Alternativa
- **API REST** - Conexión personalizada
- Sistema de autenticación (preparado)

### 📱 Responsivo
- ✅ Desktop optimizado
- ✅ Tablet compatible
- ✅ Mobile friendly

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm o yarn

### Installation

```bash
# Clonar repositorio
git clone https://github.com/Medico96/Domino-ENARM.git
cd Domino-ENARM

# Instalar dependencias
npm install

# Crear archivo de configuración
cp .env.example .env.local

# Editar con tus credenciales
# Supabase:
# VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
# VITE_SUPABASE_ANON_KEY=tu-clave
```

### Development

```bash
npm run dev
# Abre http://localhost:5173
```

### Production

```bash
npm run build
npm run preview
```

---

## 📚 Documentación

- **[SETUP.md](./SETUP.md)** - Guía de instalación y configuración
- **[INTEGRACION_API.md](./INTEGRACION_API.md)** - Guía detallada de integración con BD

---

## 🏗️ Estructura del Proyecto

```
src/
├── components/
│   ├── SimulatorHeader.tsx      # Header con navegación
│   ├── SidePanel.tsx             # Panel de filtros
│   ├── QuestionCard.tsx          # Tarjeta de pregunta
│   ├── Statistics.tsx            # Panel de estadísticas
│   ├── ResultsModal.tsx          # Modal de resultados
│   └── HelpModal.tsx             # Modal de ayuda
├── services/
│   └── questionService.ts        # Servicio para obtener preguntas
├── types/
│   └── env.d.ts                  # Tipos de variables de entorno
├── App.tsx                       # Componente principal
├── main.tsx                      # Entrada de la app
└── index.css                     # Estilos globales
```

---

## 🔧 Configuración

### Variables de Entorno

Crea `.env.local` en la raíz:

```env
# Opción 1: Supabase (Recomendado)
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima

# Opción 2: API REST personalizada
VITE_API_URL=https://tu-api.com/api

# Opción 3: Firebase
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
```

### Base de Datos

Tabla `preguntas` requerida:

```sql
CREATE TABLE preguntas (
  id BIGINT PRIMARY KEY,
  pregunta TEXT,
  opcionA TEXT,
  opcionB TEXT,
  opcionC TEXT,
  opcionD TEXT,
  respuesta_correcta VARCHAR(1),
  especialidad VARCHAR(100),
  materia VARCHAR(100),
  explicacion TEXT
);
```

---

## 💡 Uso

### Para el Usuario

1. **Inicio**: Selecciona especialidad y número de preguntas
2. **Simulador**: Responde preguntas dentro del tiempo limite
3. **Navegación**: Usa botones o click directo en preguntas
4. **Resultados**: Revisa tu desempeño detallado

### Para el Desarrollador

```typescript
// Cargar preguntas
import { fetchQuestions } from './services/questionService';

const questions = await fetchQuestions({
  especialidad: 'Cardiología',
  limit: 10
});

// Guardar respuesta
import { saveUserAnswer } from './services/questionService';

await saveUserAnswer(userId, questionId, 'A', true);

// Obtener estadísticas
import { getUserStatistics } from './services/questionService';

const stats = await getUserStatistics(userId);
```

---

## 🎨 Personalización

### Cambiar colores

Edita los colores de Tailwind en los componentes:
```tsx
// De:
className="bg-blue-600 to-blue-700"

// A:
className="bg-purple-600 to-purple-700"
```

### Agregar especialidades

En `src/components/SidePanel.tsx`:
```typescript
const specialties = [
  { value: 'cardiologia', label: 'Cardiología' },
  // Agrega más aquí
];
```

### Modificar preguntas

Actualiza directamente en tu BD:
```sql
INSERT INTO preguntas VALUES (...)
```

---

## 🚀 Desplegar

### Vercel (Recomendado)

```bash
# 1. Push a GitHub
git push origin main

# 2. En vercel.com → New Project
# 3. Selecciona el repo
# 4. Configura variables de entorno
# 5. Deploy!
```

### Netlify

```bash
npm run build
# Sube carpeta 'dist/' a netlify.com
```

### Tu Servidor

```bash
npm run build
# Sube contenido de 'dist/' a tu servidor
```

---

## 📊 Estadísticas

El simulador proporciona:

- **Desempeño General** - Porcentaje de aciertos
- **Análisis por Tipo** - Correctas, incorrectas, omitidas
- **Detalles Pregunta** - Revisión individual
- **Historial** - Guardar en BD (opcional)

---

## 🔐 Seguridad

- ✅ Variables de entorno protegidas
- ✅ RLS en Supabase
- ✅ Headers CORS configurados
- ✅ Sin datos sensibles en frontend

---

## 🤝 Contribuir

Contribuciones bienvenidas:

1. Fork el proyecto
2. Crea rama (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add some AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 Licencia

MIT - Ver [LICENSE](LICENSE) para detalles

---

## 👨‍💻 Autor

**Medico96**
- GitHub: [@Medico96](https://github.com/Medico96)

---

## 📞 Soporte

- 📖 Lee [SETUP.md](./SETUP.md) para instalación
- 🔗 Ver [INTEGRACION_API.md](./INTEGRACION_API.md) para BD
- 💬 Abre un issue en GitHub
- 📧 Contacta al autor

---

## 🎯 Roadmap

- [x] Interfaz profesional
- [x] Sistema de preguntas
- [x] Estadísticas
- [ ] Autenticación de usuarios
- [ ] Historial de simuladores
- [ ] Análisis avanzado de errores
- [ ] App móvil nativa
- [ ] Inteligencia artificial para recomendaciones

---

## ⭐ Apoya el Proyecto

Si te ha sido útil, dale una ⭐ en GitHub

---

**Versión 1.0.0** - Listo para producción ✅
