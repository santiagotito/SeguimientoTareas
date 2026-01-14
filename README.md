# Tráfico Proyectos JMC - Sistema de Gestión de Tareas

Sistema de seguimiento de tareas para equipos de analítica con integración a Google Sheets y generación de reportes con IA.

## 🚀 Características

✅ Login con usuarios y contraseñas  
✅ Tablero Kanban con drag & drop  
✅ Vista Gantt (cronograma)  
✅ Vista por Equipo  
✅ Integración con Google Sheets  
✅ Generación de reportes diarios con Gemini AI  
✅ CRUD completo de tareas  

## 📋 Requisitos Previos

1. **Google Sheet configurado** con estas hojas:
   - `Users` (columnas: id, name, email, password, role, avatar)
   - `Tasks` (columnas: id, title, description, status, priority, assigneeId, startDate, dueDate, tags)

2. **API Keys**:
   - Google Sheets API Key
   - Gemini API Key (opcional, para reportes)

## 🛠️ Instalación Local

```bash
# Clonar repositorio
git clone https://github.com/TU_USUARIO/analytics-hub.git
cd analytics-hub

# Instalar dependencias
npm install

# Configurar variables de entorno
# Copiar .env.local y agregar tus keys

# Ejecutar en desarrollo
npm run dev
```

## 🌐 Deploy en GitHub Pages

### 1. Subir a GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/analytics-hub.git
git push -u origin main
```

### 2. Configurar Secrets
Ve a: `Settings → Secrets and variables → Actions`

Agregar estos secrets:
- `VITE_GOOGLE_SHEETS_API_KEY`
- `VITE_GOOGLE_SHEETS_ID`
- `GEMINI_API_KEY`

### 3. Activar GitHub Pages
1. `Settings → Pages`
2. Source: **GitHub Actions**
3. Espera 2-3 minutos al deploy

### 4. Acceder
```
https://TU_USUARIO.github.io/analytics-hub/
```

## 👥 Usuarios Demo

- **Manager**: ana@analytics.com / admin123
- **Data Scientist**: carlos@analytics.com / user123
- **Data Engineer**: sofia@analytics.com / user123
- **Analyst**: miguel@analytics.com / user123

## 📝 Estructura del Google Sheet

### Hoja "Users"
```
id | name          | email                 | password | role           | avatar
u1 | Ana García    | ana@analytics.com     | admin123 | Manager        | https://...
u2 | Carlos Ruiz   | carlos@analytics.com  | user123  | Data Scientist | https://...
```

### Hoja "Tasks"
```
id | title | description | status | priority | assigneeId | startDate | dueDate | tags
t1 | ...   | ...         | todo   | high     | u1         | 2024-...  | 2024... | Tag1,Tag2
```

## 🔧 Tecnologías

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Lucide Icons
- Google Sheets API
- Gemini AI API

## 📄 Licencia

MIT

---
*Last update: 2026-01-14*
