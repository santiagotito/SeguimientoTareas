# 🚀 Analytics Hub - Sistema de Gestión de Tareas

## ✅ TODO LISTO PARA USAR - 100% FUNCIONAL

### Sistema completamente integrado con:
- ✅ Gestión de Clientes (15 clientes mock incluidos)
- ✅ Gestión de Tareas con múltiples responsables
- ✅ Gestión de Equipo
- ✅ Filtros avanzados (estado, prioridad, responsable, cliente, búsqueda por nombre)
- ✅ Vistas: Kanban, Gantt, Equipo
- ✅ Integración con Google Sheets
- ✅ Reportes automáticos
- ✅ Fechas sin problemas de zona horaria

---

## 🎯 INSTALACIÓN RÁPIDA (5 minutos):

### 1. Preparar Google Sheets:

#### A) Crear hoja "Clients" (NUEVA):
1. Abrir tu Google Sheet
2. Click derecho en pestaña → Insertar hoja
3. Nombrar: **"Clients"**
4. En fila 1 agregar headers:
   - A1: **id**
   - B1: **name**

#### B) Actualizar hoja "Tasks":
- La columna K ahora es **clientId** (se agregó automáticamente al guardar)

### 2. Actualizar Apps Script:

1. Abrir Google Sheet → **Extensiones → Apps Script**
2. Copiar TODO el contenido de `google-apps-script.js`
3. Pegar en Apps Script (reemplazar todo)
4. **Guardar** (Ctrl + S)
5. Click **Implementar → Administrar implementaciones**
6. Click lápiz ✏️ en implementación actual
7. **Nueva versión**
8. **Implementar**
9. Si cambió la URL, copiarla y actualizar en `.env.local`:
   ```
   VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/NUEVA_URL/exec
   ```

### 3. Instalar y ejecutar:

```bash
npm install
npm run dev
```

### 4. Probar:

**Login:** santiago@rangle.ec / ram2024

**Funcionalidades:**
- ✅ Ver/crear/editar clientes
- ✅ Asignar cliente a tareas
- ✅ Filtrar por cliente
- ✅ Buscar tareas por nombre
- ✅ Todo sincronizado con Google Sheets

---

## 🎨 FUNCIONALIDADES PRINCIPALES:

### Gestión de Clientes (NUEVO):
- Crear, editar, eliminar clientes
- 15 clientes mock incluidos (Coca-Cola, Nestlé, etc.)
- Asignar cliente a cada tarea
- Filtrar tareas por cliente

### Gestión de Tareas:
- Múltiples responsables por tarea
- Drag & drop en Kanban
- Vista Gantt con cronograma
- Filtros avanzados
- Alertas de tareas vencidas

### Filtros Mejorados:
- ✅ Por estado
- ✅ Por prioridad
- ✅ Por responsable
- ✅ Por cliente (NUEVO)
- ✅ Por nombre de tarea (NUEVO)
- ✅ Por rango de fechas

### Integración Sheets:
- Lectura/escritura automática
- 3 hojas: Tasks, Users, Clients
- Sincronización bidireccional

---

## 📁 ESTRUCTURA GOOGLE SHEETS:

### Hoja "Tasks" (A-K):
```
A: id
B: title
C: description
D: status
E: priority
F: assigneeId
G: startDate
H: dueDate
I: tags
J: assigneeIds
K: clientId (NUEVO)
```

### Hoja "Users" (A-F):
```
A: id
B: name
C: email
D: password
E: role
F: avatar
```

### Hoja "Clients" (A-B) - NUEVA:
```
A: id
B: name
```

---

## 🚀 DEPLOY A GITHUB PAGES:

```bash
# 1. Crear repo en GitHub
# 2. Subir código
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/tu-repo.git
git push -u origin main

# 3. Configurar Secrets en GitHub → Settings → Secrets → Actions:
GEMINI_API_KEY
VITE_APPS_SCRIPT_URL
VITE_GOOGLE_SHEETS_API_KEY
VITE_GOOGLE_SHEETS_ID

# 4. Activar GitHub Pages:
Settings → Pages → Source: GitHub Actions

# 5. Esperar 2-3 minutos → Tu app estará en:
https://TU_USUARIO.github.io/tu-repo/
```

---

## 🎯 PRÓXIMAS MEJORAS SUGERIDAS:

1. **Vista de Tabla** - Exportar a Excel/CSV
2. **Ordenamiento en Kanban** - Por prioridad, cliente, fecha
3. **Navegación en Gantt** - Slider de fechas
4. **Animación de celebración** - Al completar tarea
5. **Notificaciones** - Email automático de tareas vencidas

---

## 📞 SOPORTE:

- **Documentación completa:** Ver `DOCUMENTACION_COMPLETA.md`
- **Guía de deploy:** Ver `DEPLOY_GUIDE.md`
- **Conexión Sheets:** Ver `CONEXION_SHEETS.md`

---

## ✅ ESTADO ACTUAL:

**100% FUNCIONAL** - Listo para producción

Todos los componentes integrados y probados.
