# 🔄 Sistema de Tareas Recurrentes - Guía Completa

## 📋 ¿Qué son las Tareas Recurrentes?

Las tareas recurrentes te permiten crear una tarea que se repite automáticamente en días específicos de la semana. En lugar de crear manualmente "Publicar tablero" para lunes, miércoles y viernes, creas **una sola tarea recurrente** y el sistema genera automáticamente las instancias para cada día.

## 🎯 Características Principales

### ✨ Creación Inteligente
- **Una tarea padre** define la recurrencia
- **Instancias automáticas** se generan para cada día especificado
- **Contadores en tiempo real** muestran progreso (ej: 3/7 completadas)
- **Gestión centralizada** desde la tarea padre

### 📊 Indicadores Visuales
- 🟣 **Tarea Padre Recurrente**: Borde morado, indicador con días (LMJV) y contador
- 🔵 **Instancia Recurrente**: Borde azul, indicador "Recurrente"
- ⚠️ **Tareas Vencidas**: Borde rojo, alerta de vencimiento

### 🔧 Funcionalidades Avanzadas
- **Generación retroactiva**: Crea tareas pendientes de hasta 30 días atrás
- **Sincronización automática**: Actualiza contadores cada 10 segundos
- **Rango de fechas**: Define inicio y fin de la recurrencia

## 🚀 Cómo Usar Tareas Recurrentes

### 1. Crear Tarea Recurrente

1. **Clic en "Nueva Tarea"**
2. **Llenar información básica**:
   - Título: "Publicar tablero de ventas"
   - Descripción: "Subir reporte diario al Teams"
   - Responsables: Seleccionar quién la ejecuta
   - Prioridad y Cliente

3. **Activar Recurrencia**:
   - ✅ Marcar "Tarea Recurrente"
   - **Seleccionar días**: L M M J V (Lunes a Viernes)
   - **Fecha inicio**: Cuándo empezar a generar tareas
   - **Fecha fin**: Hasta cuándo generar (límite)

4. **Guardar**: El sistema creará la tarea padre

### 2. Generación Automática

**Al crear la tarea recurrente, el sistema:**
- ✅ Crea la tarea padre (NO se ejecuta, solo administra)
- ✅ Genera automáticamente instancias para días pasados (últimos 30 días)
- ✅ Continúa generando instancias día a día

**Ejemplo práctico:**
- Tarea padre: "Publicar tablero" (L-M-J-V)
- Instancias generadas:
  - "Publicar tablero (2024-12-20)" - Lunes
  - "Publicar tablero (2024-12-21)" - Martes  
  - "Publicar tablero (2024-12-23)" - Jueves
  - "Publicar tablero (2024-12-24)" - Viernes

### 3. Seguimiento y Ejecución

#### En el Tablero Kanban:
- **Tarea Padre** 🟣: Muestra "LMJV 2/4" (2 completadas de 4)
- **Instancias** 🔵: Son las que realmente ejecutas
- **Vencidas** ⚠️: Aparecen en rojo si no se hicieron a tiempo

#### Workflow típico:
1. **Ves la instancia**: "Publicar tablero (2024-12-23)"
2. **La ejecutas**: Arrastras a "En Progreso" → "Finalizado"
3. **El contador se actualiza**: La tarea padre ahora muestra "3/4"

## 📈 Casos de Uso Reales

### 🎯 Ejemplo 1: Reportes Diarios
```
Tarea: "Enviar reporte de tráfico"
Días: Lunes a Viernes
Resultado: 5 instancias por semana automáticamente
```

### 📊 Ejemplo 2: Reuniones Semanales  
```
Tarea: "Reunión de seguimiento cliente X"
Días: Miércoles
Resultado: 1 instancia por semana automáticamente
```

### 📝 Ejemplo 3: Publicaciones en RRSS
```
Tarea: "Publicar contenido LinkedIn"
Días: Lunes, Miércoles, Viernes
Resultado: 3 instancias por semana automáticamente
```

## ⚡ Ventajas del Sistema

### ❌ Antes (Manual)
- Crear "Reporte Lunes", "Reporte Martes", etc.
- 20 tareas duplicadas por mes
- Difícil seguimiento del progreso general
- Riesgo de olvidar crear tareas

### ✅ Ahora (Recurrente)  
- 1 sola tarea padre controla todo
- Instancias automáticas día a día
- Contador visual inmediato: "15/20 completadas"
- Cero riesgo de olvidar tareas

## 🔧 Configuración Avanzada

### Días de la Semana
- **D** = Domingo (0)
- **L** = Lunes (1) 
- **M** = Martes (2)
- **M** = Miércoles (3)
- **J** = Jueves (4)
- **V** = Viernes (5)
- **S** = Sábado (6)

### Fechas Inteligentes
- **Inicio**: Primera fecha desde la que generar instancias
- **Fin**: Última fecha límite (opcional)
- **Retroactivo**: Genera automáticamente hasta 30 días atrás

### Sincronización
- **Tiempo real**: Actualizaciones cada 10 segundos
- **Google Sheets**: Persistencia automática
- **Multi-usuario**: Cambios visibles para todo el equipo

## 📋 Preguntas Frecuentes

### ❓ ¿Puedo editar una tarea recurrente?
Sí, al editar la **tarea padre** cambias la configuración general. Las **instancias individuales** se pueden editar por separado.

### ❓ ¿Qué pasa si no hago una tarea a tiempo?
La instancia aparece **en rojo** como vencida. Sigues pudiendo completarla, pero el sistema la marca claramente.

### ❓ ¿Puedo borrar una tarea recurrente?
Sí, al borrar la **tarea padre** se mantienen las instancias ya creadas, pero no se generan más.

### ❓ ¿Cómo veo mi progreso general?
En la **tarea padre** ves el contador (ej: "12/20") y en el dashboard personal aparecen todas las instancias pendientes.

### ❓ ¿Se crean tareas de fines de semana?
Solo si seleccionas **S** (Sábado) o **D** (Domingo) en la configuración de días.

## 🎉 ¡Beneficios Inmediatos!

- ⚡ **90% menos tiempo** creando tareas repetitivas
- 📊 **Visibilidad total** del progreso con contadores
- 🎯 **Cero olvidos** - el sistema genera automáticamente
- 👥 **Trabajo en equipo** mejorado con seguimiento visual
- 📱 **Sincronización perfecta** con Google Sheets

---

**¡Tu sistema de tareas recurrentes está listo! 🚀**

Empieza creando tu primera tarea recurrente y experimenta la diferencia.
