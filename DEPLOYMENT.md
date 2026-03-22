# 🚀 Guía de Despliegue - Dominio ENARM

## Opciones de Despliegue

---

## 1. 🌐 Vercel (Recomendado - Más Fácil)

### Paso 1: Preparar tu repositorio

```bash
# Asegurate que está en GitHub
git remote -v
# debe mostrar tu repositorio

# Si no está, agrégalo:
git remote add origin https://github.com/tu-usuario/tu-repo.git
git branch -M main
git push -u origin main
```

### Paso 2: Conectar a Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en **"New Project"**
3. Selecciona **"Import Git Repository"**
4. Busca y selecciona tu repositorio
5. Haz clic en **"Import"**

### Paso 3: Configurar variables de entorno

1. En la pantalla de configuración, ve a **"Environment Variables"**
2. Agrega tus variables:

```
VITE_SUPABASE_URL = https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY = tu-clave-anonima
```

3. Haz clic en **"Deploy"**

### Paso 4: ¡Listo!

Tu aplicación estará disponible en:
```
https://nombre-proyecto.vercel.app
```

---

## 2. 🔗 Netlify

### Opción A: Git Integration

1. Ve a [netlify.com](https://netlify.com)
2. Haz clic en **"New site from Git"**
3. Selecciona tu repositorio
4. Configuración:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Agrega variables de entorno en **"Site settings" → "Build & deploy"**
6. Redeploy

### Opción B: Drag and Drop

```bash
# Build localmente
npm run build

# Sube carpeta 'dist/' a drop.netlify.com
```

---

## 3. 🔥 Firebase Hosting

### Paso 1: Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### Paso 2: Inicializar Firebase

```bash
firebase login
firebase init hosting
```

**Responde:**
- Project: Selecciona tu proyecto Firebase
- Public directory: `dist`
- Single page app: `Yes`

### Paso 3: Build y Deploy

```bash
npm run build
firebase deploy
```

Tu sitio estará en:
```
https://tu-proyecto.firebaseapp.com
```

---

## 4. 🐳 Docker + Docker Hub

### Paso 1: Crear Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

### Paso 2: Crear .dockerignore

```
node_modules
npm-debug.log
.git
.gitignore
.env.local
dist
.DS_Store
```

### Paso 3: Build y Push

```bash
# Build imagen
docker build -t tu-usuario/dominio-enarm:latest .

# Push a Docker Hub
docker login
docker push tu-usuario/dominio-enarm:latest
```

### Paso 4: Desplegar en tu servidor

```bash
docker run -d -p 80:3000 \
  -e VITE_SUPABASE_URL=tu-url \
  -e VITE_SUPABASE_ANON_KEY=tu-clave \
  tu-usuario/dominio-enarm:latest
```

---

## 5. 📦 Servidor Propio (Ubuntu/Debian)

### Paso 1: Instalar Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Paso 2: Clonar y preparar

```bash
cd /var/www
git clone https://github.com/tu-usuario/tu-repo.git dominio-enarm
cd dominio-enarm
cp .env.example .env.local
# Editar .env.local con tus credenciales
npm install
npm run build
```

### Paso 3: Usar PM2 para mantener la app activa

```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Crear archivo start para servir la app
echo 'const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});' > server.js

# Instalar Express
npm install express

# Iniciar con PM2
pm2 start server.js --name "dominio-enarm"
pm2 save
pm2 startup
```

### Paso 4: Configurar Nginx como reverse proxy

```bash
sudo nano /etc/nginx/sites-available/default
```

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo systemctl restart nginx
```

### Paso 5: SSL con Let's Encrypt

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

---

## 6. ☁️ AWS (EC2 + S3 + CloudFront)

### Opción A: S3 + CloudFront (Estático)

```bash
# 1. Build
npm run build

# 2. Crear bucket S3
aws s3 mb s3://dominio-enarm-bucket

# 3. Subir archivos
aws s3 sync dist/ s3://dominio-enarm-bucket --delete

# 4. Hacer público
aws s3api put-bucket-policy --bucket dominio-enarm-bucket --policy '{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::dominio-enarm-bucket/*"
  }]
}'

# 5. CloudFront distribution
# (hacer en AWS console)
```

### Opción B: EC2 Instance

```bash
# En AWS Console:
# 1. Crear EC2 instance (Ubuntu 22.04)
# 2. Crear security group permitiendo puerto 80 y 443
# 3. Asignar Elastic IP

# SSH a la instancia
ssh -i tu-key.pem ubuntu@tu-ip

# Seguir instrucciones de "Servidor Propio" arriba
```

---

## 7. 🟦 GitHub Pages (Solo archivos estáticos)

### Paso 1: Actualizar vite.config.ts

```typescript
export default defineConfig({
  base: '/Dominio-ENARM/',
  // ... resto de config
})
```

### Paso 2: Actualizar package.json

```json
{
  "scripts": {
    "gh-deploy": "npm run build && gh-pages -d dist"
  }
}
```

### Paso 3: Deploy

```bash
npm install --save-dev gh-pages
npm run gh-deploy
```

Tu sitio estará en:
```
https://tu-usuario.github.io/Dominio-ENARM/
```

---

## 📋 Checklist Pre-Despliegue

- [ ] `.env.local` NO está committeado a Git
- [ ] `.env.local` tiene todas las variables necesarias
- [ ] `npm run build` compila sin errores
- [ ] `npm run build` genera carpeta `dist/`
- [ ] Probaste en local con `npm run dev`
- [ ] Credenciales de Supabase son correctas
- [ ] Base de datos tiene al menos 10 preguntas
- [ ] BD es accesible desde el servidor (RLS correcto)
- [ ] Dominio está apuntando a tu servidor (si aplica)
- [ ] HTTPS está configurado (si aplica)

---

## 🔐 Variables de Entorno en Producción

En cada plataforma, asegúrate de agregar:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-pública
```

**NUNCA** agregues:
- ❌ Claves privadas
- ❌ Database URLs privadas
- ❌ Tokens sensibles

---

## 🔍 Verificación Post-Despliegue

```bash
# Verifica que carga
curl https://tu-sitio.com

# Verifica que no hay errores
# Abre en navegador y revisa console (F12)

# Verifica que carga desde BD
# Ve al simulador y verifica preguntas

# Revisa performance
# Usa https://pagespeed.web.dev/
```

---

## ❌ Troubleshooting

### Error: "VITE_SUPABASE_URL is not defined"

**Solución**: Agregar variable de entorno en la plataforma

### Error: "CORS error"

**Solución**: 
- Verificar RLS en Supabase
- Permitir localhost en desarrollo
- Permitir tu dominio en producción

### Error: "Cannot GET /"

**Solución**: Asegurar que:
- `npm run build` generó dist/
- Servidor sirve dist/index.html para todas las rutas

---

## 📊 Costos Estimados (USD/mes)

| Plataforma | Costo | Notas |
|-----------|-------|-------|
| Vercel | Free - $20 | Muy recomendado |
| Netlify | Free - $19 | Buena opción |
| GitHub Pages | Free | Solo estático |
| Firebase | Free - $25 | Bueno con Firestore |
| AWS S3 + CF | $1-5 | Si mucho tráfico |
| Servidor propio | $5-20 | DigitalOcean, Linode |

---

## 📞 Soporte

- 📖 Vercel Docs: https://vercel.com/docs
- 🔗 Netlify Docs: https://docs.netlify.com
- 🔥 Firebase Docs: https://firebase.google.com/docs
- 🐳 Docker Docs: https://docs.docker.com
- AWS Docs: https://docs.aws.amazon.com

---

¡Elige la opción que mejor se adapte a tus necesidades! 🎯
