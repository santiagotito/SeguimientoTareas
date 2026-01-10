# SOLUCIÓN: Apps Script no está sirviendo código actualizado

## Problema
La URL del deployment sigue devolviendo `{"status":"Apps Script activo"}` en lugar del código actualizado con la función `doGet` que incluye el parámetro `test=config`.

## Causa
El deployment está "congelado" en una versión antigua del código. Aunque edites el código en el editor, el deployment web sigue sirviendo la versión vieja.

## Solución Paso a Paso

### OPCIÓN 1: Actualizar deployment existente (MÁS RÁPIDO)

1. Abre tu Google Sheet: `https://docs.google.com/spreadsheets/d/1jGKdkgzHBFLyXmAcGYKLF5dmjQhCtyaGPqWEJOhEi48`

2. Click en **Extensiones** → **Apps Script**

3. Verifica que el código tenga esta función:
```javascript
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();

  // Test endpoint
  if (e.parameter.test === 'config') {
    const configSheet = sheet.getSheetByName('Settings');
    if (!configSheet) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'Hoja Settings no existe',
        timestamp: new Date().toISOString()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const configData = configSheet.getDataRange().getValues();
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Apps Script funcionando correctamente',
      settingsData: configData,
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // Resto del código...
}
```

4. Click en **Implementar** (arriba a la derecha)

5. Click en **Gestionar implementaciones**

6. Verás una lista de implementaciones. Busca la que está **ACTIVA** (tiene un switch verde)

7. Click en el **ícono de lápiz** (editar) junto a esa implementación

8. En el diálogo que aparece:
   - En **Nueva descripción**: pon algo como "Versión con Settings - 2026-01-10"
   - Click en **Crear versión**

9. Click en **Implementar**

10. **IMPORTANTE**: La URL **NO cambia**. Sigue siendo:
```
https://script.google.com/macros/s/AKfycbyKg94Xer-Pipjd12x9UaCLqeCPNg-iqPHgfxzT2GqJtpYjxDo6AEQGtwL6jQtgfDT7/exec
```

11. Espera 1-2 minutos para que el deployment se propague

12. Prueba en el navegador:
```
https://script.google.com/macros/s/AKfycbyKg94Xer-Pipjd12x9UaCLqeCPNg-iqPHgfxzT2GqJtpYjxDo6AEQGtwL6jQtgfDT7/exec?test=config
```

Deberías ver algo como:
```json
{
  "success": true,
  "message": "Apps Script funcionando correctamente",
  "settingsData": [
    ["appName", "logo"],
    ["Tráfico Analítica RAM", "https://rangle.ec/img/ram.webp"]
  ],
  "timestamp": "2026-01-10T..."
}
```

---

### OPCIÓN 2: Deployment completamente nuevo (SI OPCIÓN 1 NO FUNCIONA)

1. Abre tu Google Sheet

2. **Extensiones** → **Apps Script**

3. **Implementar** → **Gestionar implementaciones**

4. **ELIMINA todas las implementaciones** (click en los 3 puntos → Archivar)

5. **Implementar** → **Nueva implementación**

6. Click en el ícono de engranaje junto a "Seleccionar tipo"

7. Selecciona **Aplicación web**

8. Configuración:
   - **Descripción**: "Deployment Settings - Enero 2026"
   - **Ejecutar como**: **Yo** (tu cuenta de Google)
   - **Quién tiene acceso**: **Cualquier persona**

9. Click **Implementar**

10. Copia la **nueva URL** que aparece

11. Actualiza el archivo `.env.local`:
```
VITE_APPS_SCRIPT_URL=<NUEVA_URL_AQUI>
```

12. **REINICIA el servidor de desarrollo**:
```bash
npm run dev
```

---

## Verificación

Una vez actualizado el deployment, abre el archivo:
```
test-config-save.html
```

Y click en **"Probar Guardado"**

Deberías ver:
- ✅ El deployment tiene el código actualizado
- ✅ POST enviado
- 📊 Verificación final con los datos guardados

---

## Notas Importantes

1. **Cada vez que edites `google-apps-script.js`**, debes crear una nueva versión del deployment (Opción 1, pasos 4-11)

2. **No cambies el "Ejecutar como"** - debe ser siempre "Yo"

3. **No cambies "Quién tiene acceso"** - debe ser "Cualquier persona" para que la app pueda llamarlo

4. Si ves el error `{"status":"Apps Script activo"}`, significa que el deployment NO se actualizó correctamente

5. **El cache del navegador puede causar problemas** - usa `Ctrl+F5` para hacer hard refresh al probar las URLs
