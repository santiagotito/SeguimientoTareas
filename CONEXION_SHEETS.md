# Cómo Conectar con Google Sheets

## Estado Actual
✅ La app YA ESTÁ conectada a Google Sheets
✅ Lee usuarios desde la hoja "Users"
✅ Lee tareas desde la hoja "Tasks" (si existen)
❌ NO escribe en Sheets (solo guarda en localStorage)

## Cómo Funciona Ahora

### 1. Al cargar la app (`loadData()`)
```
src/App.tsx línea ~60
```
- Intenta cargar usuarios de Sheets
- Si no hay usuarios → usa usuarios mock (los 4 por defecto)
- Intenta cargar tareas de Sheets
- Si no hay tareas → usa localStorage o tareas iniciales

### 2. Al crear/editar tareas (`saveTasks()`)
```
src/App.tsx línea ~82
```
- Guarda en el estado de React
- Guarda en localStorage (backup)
- **NO guarda en Sheets** (pendiente)

## ¿Qué Falta para Escribir en Sheets?

Google Sheets API **solo permite LEER** con API Key.
Para ESCRIBIR necesitas:

### Opción A: Google Apps Script (Recomendado)
1. Abre tu Google Sheet
2. Extensiones → Apps Script
3. Pega este código:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const tasksSheet = sheet.getSheetByName('Tasks');
  const data = JSON.parse(e.postData.contents);
  
  // Limpiar hoja
  tasksSheet.clear();
  
  // Headers
  tasksSheet.appendRow(['id', 'title', 'description', 'status', 'priority', 'assigneeId', 'startDate', 'dueDate', 'tags']);
  
  // Tareas
  data.tasks.forEach(task => {
    tasksSheet.appendRow([
      task.id,
      task.title,
      task.description,
      task.status,
      task.priority,
      task.assigneeIds?.join(',') || task.assigneeId || '',
      task.startDate,
      task.dueDate,
      task.tags.join(',')
    ]);
  });
  
  return ContentService.createTextOutput(JSON.stringify({success: true}));
}
```

4. Implementar → Nueva implementación
5. Tipo: Aplicación web
6. Ejecutar como: Yo
7. Quién tiene acceso: Cualquiera
8. Copiar la URL generada

9. En `src/services/sheetsService.ts` agregar:
```typescript
const APPS_SCRIPT_URL = 'TU_URL_AQUI';

async saveTasks(tasks: any[]) {
  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ tasks })
    });
  } catch (error) {
    console.error('Error saving to Sheets:', error);
  }
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
```

### Opción B: Backend con OAuth2
Requiere servidor Node.js con credenciales OAuth2.
Más complejo pero más seguro.

## ¿Cómo Probar la Lectura desde Sheets?

1. Llena tu hoja "Users" con:
```
id  | name       | email              | password | role         | avatar
u1  | Tu Nombre  | tu@email.com       | 123456   | Manager      | https://picsum.photos/200
```

2. Llena tu hoja "Tasks" con:
```
id | title      | description | status | priority | assigneeId | startDate            | dueDate              | tags
t1 | Tarea Test | Descripción | todo   | high     | u1         | 2024-12-08T00:00:00Z | 2024-12-15T00:00:00Z | Test
```

3. Recarga la app → Debería mostrar tus datos

## Verificar Conexión

En la consola del navegador (F12):
- ✅ Sin errores = Conexión OK
- ❌ Error 403 = Permisos del Sheet
- ❌ Error 404 = ID del Sheet incorrecto

## Resumen

**Lectura:** ✅ Funciona (API Key)
**Escritura:** ❌ Requiere Apps Script o Backend

**Sin Apps Script:** Las tareas se guardan SOLO en localStorage del navegador.
**Con Apps Script:** Las tareas se sincronizan con Google Sheets.
