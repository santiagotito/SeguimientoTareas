# 🚀 Guía Completa de Deploy

## Parte 1: Configurar Google Sheets (Escritura)

### 1. Crear Apps Script
1. Abre tu Sheet: https://docs.google.com/spreadsheets/d/1jGKdkgzHBFLyXmAcGYKLF5dmjQhCtyaGPqWEJOhEi48/edit
2. **Extensiones → Apps Script**
3. Pega el código de `google-apps-script.js` (incluido en este proyecto)
4. Guardar (Ctrl + S)

### 2. Implementar Apps Script
1. Click **Implementar** → **Nueva implementación**
2. **Tipo:** Aplicación web
3. **Ejecutar como:** Yo
4. **Quién tiene acceso:** Cualquiera
5. Click **Implementar**
6. **COPIAR LA URL** generada

### 3. Configurar la URL en local
Edita `.env.local` y agrega:
```bash
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/TU_URL_AQUI/exec
```
### 3.1 INSTALA NODE
https://nodejs.org/
- Ejecutar instalador
- Next, Next, Next
- Finish
# Cerrar y abrir PowerShell de nuevo
node --version
npm --version
cd ruta/del/proyecto
npm install


### 4. Probar localmente
```bash
npm run dev
```
- Crea una tarea
- Abre tu Google Sheet
- Debería aparecer en la hoja "Tasks"

---

## Parte 2: Subir a GitHub

### 1. Crear repositorio en GitHub
1. Ve a: https://github.com/new
2. Nombre: `analytics-hub` (o el que prefieras)
3. **NO marques** "Initialize with README"
4. Click **Create repository**

### 2. Preparar tu proyecto local
```bash
# En VS Code, abre la terminal (Ctrl + Ñ)

# Inicializar Git
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "Initial commit: Tráfico Analítica RAM"

# Agregar remoto (CAMBIA TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/analytics-hub.git

# Cambiar a branch main
git branch -M main

# Subir
git push -u origin main
```

**Si pide usuario/contraseña:**
- Usuario: tu usuario de GitHub
- Contraseña: usa un **Personal Access Token** (no tu contraseña)
  - Genera uno aquí: https://github.com/settings/tokens
  - Scopes necesarios: `repo`

---

## Parte 3: Configurar GitHub Pages

### 1. Agregar Secrets
1. Ve a tu repo en GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Agrega estos 4 secrets:

```
Nombre: VITE_GOOGLE_SHEETS_API_KEY
Valor: AIzaSyC8llGU58K1JmLPsH1XAS-El3Px2sTf6-E

Nombre: VITE_GOOGLE_SHEETS_ID
Valor: 1jGKdkgzHBFLyXmAcGYKLF5dmjQhCtyaGPqWEJOhEi48

Nombre: GEMINI_API_KEY
Valor: AIzaSyBVlKAEUnJsvUv_rLxJiNaaw1Utk1aFUkM

Nombre: VITE_APPS_SCRIPT_URL
Valor: (LA URL QUE COPIASTE DEL APPS SCRIPT)
```

### 2. Activar GitHub Pages
1. **Settings** → **Pages**
2. **Source:** GitHub Actions
3. Espera 2-3 minutos

### 3. Ver tu app
```
https://TU_USUARIO.github.io/analytics-hub/
```

---

## Parte 4: Actualizar en el futuro

Cuando hagas cambios:
```bash
git add .
git commit -m "Descripción del cambio"
git push
```

El deploy es automático (GitHub Actions).

---

## ✅ Checklist Final

- [ ] Apps Script implementado
- [ ] URL del Apps Script copiada
- [ ] `.env.local` configurado con todas las variables
- [ ] Funciona localmente (`npm run dev`)
- [ ] Repositorio creado en GitHub
- [ ] Código subido (`git push`)
- [ ] Secrets configurados en GitHub
- [ ] GitHub Pages activado
- [ ] App funcionando online

---

## 🆘 Troubleshooting

### Las tareas no se guardan en Sheets
- Verifica que `VITE_APPS_SCRIPT_URL` esté en `.env.local`
- Abre la consola del navegador (F12) → busca errores
- Verifica que el Apps Script esté implementado como "Cualquiera"

### Error 403 al leer Sheets
- El Sheet debe ser público (Anyone with the link → Viewer)

### GitHub Pages muestra página en blanco
- Revisa los Secrets en GitHub (Settings → Secrets)
- Ve a Actions → revisa si hay errores en el build

### Git pide usuario/contraseña constantemente
- Usa un Personal Access Token en vez de contraseña
- O configura SSH keys
