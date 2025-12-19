# 📊 Tráfico Analítica RAM - Documentación Completa

## Índice...
1. [Descripción General](#descripción-general)
2. [Características y Funcionalidades](#características-y-funcionalidades)
3. [Arquitectura del Sistema](#arquitectura-del-sistema)
4. [Requisitos Previos](#requisitos-previos)
5. [Instalación y Configuración](#instalación-y-configuración)
6. [Estructura del Proyecto](#estructura-del-proyecto)
7. [Integración con Google Sheets](#integración-con-google-sheets)
8. [Personalización para Otro Equipo](#personalización-para-otro-equipo)
9. [Deploy en GitHub Pages](#deploy-en-github-pages)
10. [Deploy en Servidor Propio](#deploy-en-servidor-propio)
11. [Mantenimiento y Actualizaciones](#mantenimiento-y-actualizaciones)
12. [Troubleshooting](#troubleshooting)

---

## Descripción General

**Tráfico Analítica RAM** es un sistema web de gestión de tareas diseñado específicamente para equipos de analítica. Permite el seguimiento visual de proyectos, asignación de responsables, gestión de prioridades y generación automática de reportes diarios.

### Tecnologías Utilizadas
- **Frontend:** React 19 + TypeScript
- **Estilos:** Tailwind CSS
- **Build:** Vite
- **Base de Datos:** Google Sheets (via API)
- **Backend:** Google Apps Script (para escritura)
- **Hosting:** GitHub Pages / Servidor propio

---

## Características y Funcionalidades

### 1. Sistema de Autenticación
- Login con email y contraseña
- Usuarios almacenados en Google Sheets
- Sin necesidad de servidor de autenticación

### 2. Vistas de Trabajo

#### 📋 Tablero Kanban
- Drag & drop entre estados (Por Hacer, En Progreso, En Revisión, Finalizado)
- Tarjetas visuales con información de tarea
- Indicadores de prioridad (Baja, Media, Alta, Crítica)
- Alertas visuales para tareas vencidas

#### 📅 Cronograma Gantt
- Visualización temporal de tareas
- Barras de progreso por estado
- Identificación rápida de fechas límite

#### 👥 Vista de Equipo
- Carga de trabajo por persona
- Tareas asignadas a cada miembro
- Contador de tareas por estado

#### ⚙️ Gestión de Equipo
- Crear nuevos miembros
- Editar información de usuarios
- Eliminar usuarios
- Subir fotos de perfil
- Guardar automáticamente en Google Sheets

### 3. Gestión de Tareas

#### Crear Tareas
- Título y descripción
- Estado inicial
- Prioridad (4 niveles)
- Múltiples responsables (asignación múltiple)
- Fechas de inicio y vencimiento
- Tags personalizados

#### Editar/Eliminar
- Edición en tiempo real
- Eliminación con confirmación
- Historial automático en Sheets

### 4. Filtros Avanzados
- Filtro por estado (múltiple)
- Filtro por prioridad (múltiple)
- Filtro por responsable (múltiple)
- Filtro por rango de fechas
- Limpiar todos los filtros con un click

### 5. Alertas Automáticas
- Badge en header con contador de tareas vencidas
- Tarjetas vencidas con borde rojo
- Etiqueta "VENCIDA" en tareas atrasadas

### 6. Reportes Automatizados
- Generación instantánea de reporte diario
- Ordenado por prioridad y fecha límite
- Sección especial de alertas (tareas vencidas)
- Resumen por responsable
- Formato listo para email

---

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                    USUARIO (Navegador)                   │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│              React App (Frontend)                        │
│  • Vistas (Kanban, Gantt, Team)                         │
│  • Gestión de Estado (useState)                         │
│  • Componentes Reutilizables                            │
└───────────┬─────────────────────┬───────────────────────┘
            │                     │
            ▼                     ▼
┌───────────────────┐   ┌────────────────────────┐
│  Google Sheets    │   │   Google Apps Script   │
│  API (Lectura)    │   │   (Escritura)          │
│                   │   │                        │
│  • Users          │   │  • doPost()            │
│  • Tasks          │   │  • Guarda Users        │
└───────────────────┘   │  • Guarda Tasks        │
                        └────────────────────────┘
                                  │
                                  ▼
                        ┌────────────────────┐
                        │  Google Sheets     │
                        │  (Base de Datos)   │
                        └────────────────────┘
```

### Flujo de Datos

#### Lectura (App → Sheets)
1. Usuario abre la app
2. `sheetsService.getUsers()` llama a Google Sheets API
3. `sheetsService.getTasks()` llama a Google Sheets API
4. Datos se cargan en el estado de React
5. Si Sheets está vacío → usa datos mock del código

#### Escritura (App → Sheets)
1. Usuario crea/edita tarea o usuario
2. Se actualiza el estado local
3. `sheetsService.saveTasks()` o `saveUsers()` hace POST a Apps Script
4. Apps Script escribe en Google Sheets
5. Backup en localStorage del navegador

---

## Requisitos Previos

### Software Necesario
- **Node.js** 18 o superior ([Descargar](https://nodejs.org))
- **npm** (incluido con Node.js)
- **Git** ([Descargar](https://git-scm.com))
- Editor de código (VS Code recomendado)
- Navegador moderno (Chrome, Firefox, Edge)

### Cuentas Requeridas
- Cuenta de Google (para Sheets y Apps Script)
- Cuenta de GitHub (para deploy en GitHub Pages)
- Cuenta de Gemini AI (opcional, para reportes con IA)

---

## Instalación y Configuración

### 1. Clonar o Descargar el Proyecto

#### Opción A: Descargar ZIP
1. Descomprime el archivo
2. Abre la carpeta en VS Code

#### Opción B: Clonar desde GitHub
```bash
git clone https://github.com/TU_USUARIO/analytics-hub.git
cd analytics-hub
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Google Sheets

#### A. Crear Google Sheet
1. Crea un nuevo Google Sheet
2. Nómbralo: "Tráfico Analítica RAM"

#### B. Crear Hoja "Users"
**Fila 1 (Headers):**
```
id | name | email | password | role | avatar
```

**Ejemplo de datos:**
```
u1 | Santiago Tito | santiago@rangle.ec | ram2024 | Manager | https://picsum.photos/seed/santiago/200
```

#### C. Crear Hoja "Tasks"
**Fila 1 (Headers):**
```
id | title | description | status | priority | assigneeId | startDate | dueDate | tags | assigneeIds
```

*(Deja solo headers, las tareas se crearán desde la app)*

#### D. Hacer el Sheet Público
1. Click en "Compartir"
2. Acceso general: **"Cualquier persona con el enlace"**
3. Rol: **Lector**

### 4. Configurar Google Sheets API

#### A. Crear Proyecto en Google Cloud
1. Ve a: https://console.cloud.google.com
2. Click en el dropdown de proyecto → **"Nuevo proyecto"**
3. Nombre: `Analytics Hub`
4. Click **"Crear"**

#### B. Activar Google Sheets API
1. En el menú → **APIs y servicios** → **Biblioteca**
2. Busca: `Google Sheets API`
3. Click **"Habilitar"**

#### C. Crear API Key
1. **APIs y servicios** → **Credenciales**
2. Click **"Crear credenciales"** → **"Clave de API"**
3. **Copiar la clave** generada
4. Click en la clave → **Restricciones de API**:
   - Seleccionar: **Restringir clave**
   - Marcar solo: `Google Sheets API`
5. **Guardar**

### 5. Configurar Google Apps Script

#### A. Crear el Script
1. En tu Google Sheet → **Extensiones** → **Apps Script**
2. Borra todo el código por defecto
3. Copia y pega el código de `google-apps-script.js`
4. **Guardar** (Ctrl + S)

#### B. Implementar como Web App
1. Click **Implementar** → **Nueva implementación**
2. Tipo: **Aplicación web**
3. Ejecutar como: **Yo**
4. Quién tiene acceso: **Cualquiera**
5. Click **Implementar**
6. **COPIAR LA URL** generada (la necesitarás)

### 6. Configurar Variables de Entorno

Crea el archivo `.env.local` en la raíz del proyecto:

```bash
# API de Gemini (opcional, para reportes con IA)
VITE_GEMINI_API_KEY=tu_gemini_api_key

# Google Sheets (requerido)
VITE_GOOGLE_SHEETS_API_KEY=tu_sheets_api_key
VITE_GOOGLE_SHEETS_ID=id_de_tu_sheet

# Apps Script (requerido para guardar cambios)
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/TU_DEPLOY_ID/exec
```

**Ejemplo completo:**
```bash
VITE_GEMINI_API_KEY=AIzaSyBVlKAEUnJsvUv_rLxJiNaaw1Utk1aFUkM
VITE_GOOGLE_SHEETS_API_KEY=AIzaSyC8llGU58K1JmLPsH1XAS-El3Px2sTf6-E
VITE_GOOGLE_SHEETS_ID=1jGKdkgzHBFLyXmAcGYKLF5dmjQhCtyaGPqWEJOhEi48
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbwGskck.../exec
```

### 7. Ejecutar en Desarrollo

```bash
npm run dev
```

Abre: http://localhost:3000

---

## Estructura del Proyecto

```
analytics-hub/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions para deploy
├── src/
│   ├── components/
│   │   ├── Auth.tsx            # Componente de login
│   │   ├── Filters.tsx         # Componente de filtros
│   │   ├── GanttView.tsx       # Vista Gantt
│   │   ├── TaskCard.tsx        # Tarjeta de tarea
│   │   └── TeamManagement.tsx  # Gestión de equipo
│   ├── services/
│   │   ├── geminiService.ts    # Servicio de reportes
│   │   └── sheetsService.ts    # Integración con Sheets
│   ├── App.tsx                 # Componente principal
│   ├── constants.ts            # Constantes y usuarios mock
│   ├── index.tsx               # Punto de entrada
│   └── types.ts                # Definiciones de TypeScript
├── .env.local                  # Variables de entorno (NO subir a Git)
├── .gitignore                  # Archivos ignorados por Git
├── google-apps-script.js       # Código para Apps Script
├── index.html                  # HTML principal
├── package.json                # Dependencias del proyecto
├── tsconfig.json               # Configuración de TypeScript
├── vite.config.ts              # Configuración de Vite
├── DEPLOY_GUIDE.md            # Guía de deploy
└── README.md                   # Este archivo
```

### Archivos Clave

#### `src/App.tsx`
Componente principal que contiene:
- Estado global de tareas y usuarios
- Lógica de filtros
- Renderizado de vistas
- Handlers de eventos

#### `src/services/sheetsService.ts`
Maneja toda la comunicación con Google Sheets:
- `getUsers()` - Leer usuarios
- `getTasks()` - Leer tareas
- `saveUsers()` - Guardar usuarios
- `saveTasks()` - Guardar tareas

#### `src/components/TeamManagement.tsx`
Componente completo para gestión de usuarios:
- CRUD de usuarios
- Subida de imágenes
- Validación de formularios

#### `google-apps-script.js`
Script de backend que se ejecuta en Google:
- Recibe datos via POST
- Escribe en hojas Users y Tasks
- Maneja errores

---

## Integración con Google Sheets

### Cómo Funciona

#### Lectura (GET)
```typescript
// En sheetsService.ts
async getUsers() {
  const range = 'Users!A:F';
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return parseUsers(data.values);
}
```

**Google Sheets API** permite leer hojas públicas con solo una API Key.

#### Escritura (POST)
```typescript
// En sheetsService.ts
async saveUsers(users) {
  await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify({ users }),
    mode: 'no-cors'
  });
}
```

**Apps Script** recibe el POST y escribe en el Sheet con tus permisos de propietario.

### Por Qué Esta Arquitectura

| Método | Ventaja | Limitación |
|--------|---------|------------|
| **Sheets API (GET)** | Simple, sin autenticación OAuth | Solo lectura |
| **Apps Script (POST)** | Puede escribir, sin servidor propio | Requiere implementación |

### Sincronización

- **Lectura:** Al cargar la app
- **Escritura:** Cada cambio (crear, editar, eliminar)
- **Backup:** localStorage del navegador
- **Conflictos:** Último cambio gana (no hay merge)

---

## Personalización para Otro Equipo

### 1. Cambiar Nombre y Branding

#### `index.html` (línea 6)
```html
<title>Nombre de Tu Equipo</title>
```

#### `src/App.tsx` (línea ~150)
```tsx
<span>Nombre de Tu Equipo</span>
```

#### `src/components/Auth.tsx` (línea ~50)
```tsx
<h1>Nombre de Tu Equipo</h1>
<p>Sistema de Gestión de Tareas</p>
```

### 2. Cambiar Dominio de Email

#### `src/components/Auth.tsx` (línea ~70)
```tsx
<input
  type="email"
  placeholder="usuario@tudominio.com"
```

#### `src/components/TeamManagement.tsx` (línea ~180)
```tsx
<input
  placeholder="usuario@tudominio.com"
```

### 3. Personalizar Usuarios Iniciales

#### `src/constants.ts`
```typescript
export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Tu Nombre',
    email: 'tu@tudominio.com',
    password: 'tu_password',
    avatar: 'https://...',
    role: 'Manager'
  },
  // ... más usuarios
];
```

### 4. Personalizar Roles

#### `src/types.ts` (línea ~10)
```typescript
role: 'Manager' | 'Team Lead' | 'Developer' | 'Designer';
```

#### Actualizar en:
- `src/constants.ts` (usuarios mock)
- `src/components/TeamManagement.tsx` (select de roles)

### 5. Cambiar Estados de Tareas

#### `src/constants.ts`
```typescript
export const STATUS_LABELS: Record<string, string> = {
  backlog: 'Backlog',
  todo: 'Por Hacer',
  inprogress: 'En Desarrollo',
  testing: 'En Testing',
  done: 'Completado'
};
```

#### `src/types.ts`
```typescript
export type Status = 'backlog' | 'todo' | 'inprogress' | 'testing' | 'done';
```

### 6. Ajustar Prioridades

#### `src/types.ts`
```typescript
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
```

### 7. Cambiar Colores del Theme

#### `index.html` (configuración Tailwind)
```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: '#FF6B6B',  // Tu color principal
        secondary: '#4ECDC4'  // Tu color secundario
      }
    }
  }
}
```

---

## Deploy en GitHub Pages

### Paso 1: Preparar el Proyecto

#### A. Crear repositorio en GitHub
1. Ve a: https://github.com/new
2. Nombre: `analytics-hub` (o el que prefieras)
3. **NO marcar** "Initialize with README"
4. Click **"Create repository"**

#### B. Configurar `vite.config.ts`
```typescript
export default defineConfig({
  base: './', // Para GitHub Pages
  // ... resto de configuración
});
```

### Paso 2: Subir Código a GitHub

```bash
# Inicializar Git (si no está inicializado)
git init

# Agregar archivos
git add .

# Primer commit
git commit -m "Initial commit: Tráfico Analítica"

# Agregar remoto (CAMBIA TU_USUARIO y TU_REPO)
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git

# Cambiar a branch main
git branch -M main

# Subir
git push -u origin main
```

**Si pide autenticación:**
- Usuario: tu usuario de GitHub
- Contraseña: **Personal Access Token** (no tu contraseña)
  - Crear token: https://github.com/settings/tokens
  - Scopes: `repo`

### Paso 3: Configurar Secrets en GitHub

1. Ve a tu repositorio en GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**

Agregar estos 4 secrets:

```
Name: VITE_GOOGLE_SHEETS_API_KEY
Secret: [tu_api_key]

Name: VITE_GOOGLE_SHEETS_ID
Secret: [tu_sheet_id]

Name: GEMINI_API_KEY
Secret: [tu_gemini_key]

Name: VITE_APPS_SCRIPT_URL
Secret: [tu_apps_script_url]
```

### Paso 4: Activar GitHub Pages

1. **Settings** → **Pages**
2. **Source:** GitHub Actions
3. Espera 2-3 minutos

### Paso 5: Acceder a tu App

```
https://TU_USUARIO.github.io/TU_REPO/
```

### Actualizaciones Futuras

Cuando hagas cambios:
```bash
git add .
git commit -m "Descripción del cambio"
git push
```

El deploy es automático (GitHub Actions se encarga).

---

## Deploy en Servidor Propio

### Opción 1: Servidor Node.js (VPS, AWS, etc.)

#### Requisitos
- Servidor con Ubuntu/Debian
- Node.js 18+
- Nginx (como proxy reverso)
- Dominio apuntando al servidor

#### 1. Preparar el Servidor

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar Nginx
sudo apt install -y nginx

# Instalar PM2 (gestor de procesos)
sudo npm install -g pm2
```

#### 2. Subir el Proyecto

```bash
# En tu computadora, construir el proyecto
npm run build

# Esto genera la carpeta 'dist'
# Sube 'dist' a tu servidor via SCP o SFTP
scp -r dist/* usuario@tu-servidor:/var/www/analytics-hub/
```

#### 3. Configurar Nginx

```bash
# Crear configuración
sudo nano /etc/nginx/sites-available/analytics-hub
```

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    root /var/www/analytics-hub;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Compresión
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

```bash
# Activar sitio
sudo ln -s /etc/nginx/sites-available/analytics-hub /etc/nginx/sites-enabled/

# Verificar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

#### 4. Configurar SSL (HTTPS)

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d tu-dominio.com

# Renovación automática (ya está configurado)
sudo certbot renew --dry-run
```

#### 5. Actualizaciones

```bash
# Construir localmente
npm run build

# Subir al servidor
scp -r dist/* usuario@tu-servidor:/var/www/analytics-hub/

# Limpiar caché de Nginx (si es necesario)
sudo systemctl reload nginx
```

### Opción 2: Hosting Estático (Vercel, Netlify)

#### Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel

# Seguir instrucciones en pantalla
# Configurar variables de entorno en: Settings → Environment Variables
```

#### Netlify

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod

# Configurar variables de entorno en: Site settings → Environment variables
```

### Opción 3: Docker

#### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

#### Construir y ejecutar

```bash
# Construir imagen
docker build -t analytics-hub .

# Ejecutar contenedor
docker run -d -p 80:80 --name analytics-hub analytics-hub

# Con docker-compose
docker-compose up -d
```

---

## Mantenimiento y Actualizaciones

### Actualizar Dependencias

```bash
# Ver dependencias desactualizadas
npm outdated

# Actualizar todas (con cuidado)
npm update

# Actualizar una específica
npm install react@latest
```

### Backup de Datos

#### Opción 1: Google Sheets
- Tus datos ya están en Google Sheets
- Google hace backup automático
- Puedes descargar como Excel: File → Download → Excel

#### Opción 2: Export Programático

```typescript
// Agregar botón "Exportar Datos"
const handleExport = () => {
  const data = {
    users,
    tasks,
    exportDate: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup-${Date.now()}.json`;
  a.click();
};
```

### Logs y Monitoreo

#### Console Logs
```typescript
// Los logs importantes ya están en el código:
console.log('✅ Tareas guardadas en Google Sheets');
console.error('❌ Error guardando en Sheets:', error);
```

#### Google Analytics (Opcional)

En `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## Troubleshooting

### Problemas Comunes

#### 1. Error 403 al cargar datos

**Causa:** Google Sheet no es público o API no habilitada

**Solución:**
```bash
# 1. Hacer Sheet público
Share → Anyone with the link → Viewer

# 2. Verificar API habilitada
https://console.cloud.google.com/apis/library/sheets.googleapis.com
```

#### 2. Cambios no se guardan en Sheets

**Causa:** VITE_APPS_SCRIPT_URL no configurada o incorrecta

**Solución:**
```bash
# Verificar .env.local
echo $VITE_APPS_SCRIPT_URL

# Debe ser algo como:
# https://script.google.com/macros/s/AKfycby.../exec
```

#### 3. La app muestra datos viejos

**Causa:** Caché del navegador

**Solución:**
```bash
# Ctrl + Shift + R (recarga forzada)
# O limpiar caché: F12 → Application → Clear storage
```

#### 4. Error al subir imagen de perfil

**Causa:** Imagen muy grande (>2MB en base64)

**Solución:**
```typescript
// Comprimir imagen antes de convertir a base64
// O usar servicio externo (Cloudinary, ImgBB)
```

#### 5. GitHub Actions falla

**Causa:** Secrets no configurados

**Solución:**
```bash
# Verificar en GitHub:
# Settings → Secrets → Actions
# Deben estar los 4 secrets
```

### Comandos Útiles

```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install

# Limpiar caché de Vite
rm -rf node_modules/.vite

# Ver errores detallados
npm run dev -- --debug

# Build para producción con source maps
npm run build -- --sourcemap
```

---

## Soporte y Contacto

Para preguntas o problemas:

1. **Revisar esta documentación**
2. **Verificar logs en consola** (F12)
3. **Revisar Google Sheets** (datos fuente)
4. **Contactar al administrador del sistema**

---

## Licencia

Este proyecto es privado y de uso interno.

© 2024 Tráfico Analítica RAM - Todos los derechos reservados.
