function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet();
    const data = JSON.parse(e.postData.contents);
    
    // SISTEMA INCREMENTAL (nuevo)
    if (data.operation && data.type && data.item) {
      return handleIncrementalOperation(sheet, data);
    }
    
    // LEGACY: Operaciones antiguas (add_task, update_task, delete_task)
    if (data.operation === 'add_task') {
      const tasksSheet = sheet.getSheetByName('Tasks');
      if (!tasksSheet) throw new Error('Hoja Tasks no encontrada');
      
      const task = data.task;
      tasksSheet.appendRow([
        task.id || '',
        task.title || '',
        task.description || '',
        task.status || 'todo',
        task.priority || 'medium',
        task.assigneeId || '',
        task.startDate || '',
        task.dueDate || '',
        (task.tags || []).join(','),
        (task.assigneeIds || []).join(','),
        task.clientId || '',
        task.completedDate || ''
      ]);
      
      return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (data.operation === 'update_task') {
      const tasksSheet = sheet.getSheetByName('Tasks');
      if (!tasksSheet) throw new Error('Hoja Tasks no encontrada');
      
      const task = data.task;
      const allData = tasksSheet.getDataRange().getValues();
      
      for (let i = 1; i < allData.length; i++) {
        if (allData[i][0] === task.id) {
          tasksSheet.getRange(i + 1, 1, 1, 12).setValues([[
            task.id,
            task.title || '',
            task.description || '',
            task.status || 'todo',
            task.priority || 'medium',
            task.assigneeId || '',
            task.startDate || '',
            task.dueDate || '',
            (task.tags || []).join(','),
            (task.assigneeIds || []).join(','),
            task.clientId || '',
            task.completedDate || ''
          ]]);
          
          return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
        }
      }
      
      return ContentService.createTextOutput(JSON.stringify({success: false})).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (data.operation === 'delete_task') {
      const tasksSheet = sheet.getSheetByName('Tasks');
      if (!tasksSheet) throw new Error('Hoja Tasks no encontrada');
      
      const taskId = data.taskId;
      const allData = tasksSheet.getDataRange().getValues();
      
      for (let i = 1; i < allData.length; i++) {
        if (allData[i][0] === taskId) {
          tasksSheet.deleteRow(i + 1);
          return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
        }
      }
      
      return ContentService.createTextOutput(JSON.stringify({success: false})).setMimeType(ContentService.MimeType.JSON);
    }
    
    // LEGACY: Guardado masivo (NO USAR - causa duplicados)
    if (data.tasks) {
      const tasksSheet = sheet.getSheetByName('Tasks') || sheet.insertSheet('Tasks');
      tasksSheet.clear();
      tasksSheet.appendRow(['id', 'title', 'description', 'status', 'priority', 'assigneeId', 'startDate', 'dueDate', 'tags', 'assigneeIds', 'clientId', 'completedDate']);
      
      data.tasks.forEach(task => {
        tasksSheet.appendRow([
          task.id,
          task.title,
          task.description,
          task.status,
          task.priority,
          task.assigneeId || '',
          task.startDate,
          task.dueDate,
          (task.tags || []).join(','),
          (task.assigneeIds || []).join(','),
          task.clientId || '',
          task.completedDate || ''
        ]);
      });
      
      return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({success: false, error: 'Operación no reconocida'})).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}

// SISTEMA INCREMENTAL
function handleIncrementalOperation(sheet, data) {
  const { operation, type, item } = data;
  
  if (type === 'task') {
    return handleTaskOperation(sheet, operation, item);
  } else if (type === 'client') {
    return handleClientOperation(sheet, operation, item);
  } else if (type === 'user') {
    return handleUserOperation(sheet, operation, item);
  }
  
  return ContentService.createTextOutput(JSON.stringify({success: false, error: 'Tipo no reconocido'})).setMimeType(ContentService.MimeType.JSON);
}

function handleTaskOperation(sheet, operation, task) {
  let tasksSheet = sheet.getSheetByName('Tasks');
  if (!tasksSheet) {
    tasksSheet = sheet.insertSheet('Tasks');
    tasksSheet.appendRow(['id', 'title', 'description', 'status', 'priority', 'assigneeId', 'startDate', 'dueDate', 'tags', 'assigneeIds', 'clientId', 'completedDate', 'recurrence', 'parentTaskId']);
  }
  
  // Helper para formatear recurrencia
  const formatRecurrence = (recurrence) => {
    if (!recurrence || !recurrence.days) return '';
    return JSON.stringify(recurrence);
  };
  
  if (operation === 'create') {
    // Verificar si ya existe
    const data = tasksSheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === task.id) {
        // Ya existe, actualizar en vez de crear
        tasksSheet.getRange(i + 1, 1, 1, 14).setValues([[
          task.id,
          task.title || '',
          task.description || '',
          task.status || 'todo',
          task.priority || 'medium',
          task.assigneeId || '',
          task.startDate || '',
          task.dueDate || '',
          (task.tags || []).join(','),
          (task.assigneeIds || []).join(','),
          task.clientId || '',
          task.completedDate || '',
          formatRecurrence(task.recurrence),
          task.parentTaskId || ''
        ]]);
        return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // No existe, crear
    tasksSheet.appendRow([
      task.id || '',
      task.title || '',
      task.description || '',
      task.status || 'todo',
      task.priority || 'medium',
      task.assigneeId || '',
      task.startDate || '',
      task.dueDate || '',
      (task.tags || []).join(','),
      (task.assigneeIds || []).join(','),
      task.clientId || '',
      task.completedDate || '',
      formatRecurrence(task.recurrence),
      task.parentTaskId || ''
    ]);
    
  } else if (operation === 'update') {
    const data = tasksSheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === task.id) {
        tasksSheet.getRange(i + 1, 1, 1, 14).setValues([[
          task.id,
          task.title || '',
          task.description || '',
          task.status || 'todo',
          task.priority || 'medium',
          task.assigneeId || '',
          task.startDate || '',
          task.dueDate || '',
          (task.tags || []).join(','),
          (task.assigneeIds || []).join(','),
          task.clientId || '',
          task.completedDate || '',
          formatRecurrence(task.recurrence),
          task.parentTaskId || ''
        ]]);
        return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
  } else if (operation === 'delete') {
    const data = tasksSheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === task.id) {
        tasksSheet.deleteRow(i + 1);
        return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
      }
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
}

function handleClientOperation(sheet, operation, client) {
  let clientsSheet = sheet.getSheetByName('Clients');
  if (!clientsSheet) {
    clientsSheet = sheet.insertSheet('Clients');
    clientsSheet.appendRow(['id', 'name']);
  }
  
  if (operation === 'create') {
    clientsSheet.appendRow([client.id, client.name]);
  } else if (operation === 'update') {
    const data = clientsSheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === client.id) {
        clientsSheet.getRange(i + 1, 1, 1, 2).setValues([[client.id, client.name]]);
        break;
      }
    }
  } else if (operation === 'delete') {
    const data = clientsSheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === client.id) {
        clientsSheet.deleteRow(i + 1);
        break;
      }
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
}

function handleUserOperation(sheet, operation, user) {
  let usersSheet = sheet.getSheetByName('Users');
  if (!usersSheet) {
    usersSheet = sheet.insertSheet('Users');
    usersSheet.appendRow(['id', 'name', 'email', 'password', 'role', 'avatar']);
  }
  
  if (operation === 'create') {
    usersSheet.appendRow([
      user.id,
      user.name,
      user.email,
      user.password || '',
      user.role,
      user.avatar
    ]);
  } else if (operation === 'update') {
    const data = usersSheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === user.id) {
        usersSheet.getRange(i + 1, 1, 1, 6).setValues([[
          user.id,
          user.name,
          user.email,
          user.password || '',
          user.role,
          user.avatar
        ]]);
        break;
      }
    }
  } else if (operation === 'delete') {
    const data = usersSheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === user.id) {
        usersSheet.deleteRow(i + 1);
        break;
      }
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
}

// ============== GENERACIÓN DE TAREAS RECURRENTES (BACKEND) ==============

/**
 * Función principal para procesar tareas recurrentes.
 * Se ejecuta mediante un trigger de tiempo (ej. cada día).
 * Utiliza LockService para evitar ejecuciones simultáneas y duplicados.
 */
function processRecurringTasks() {
  const lock = LockService.getScriptLock();
  // Esperar máximo 10 minutos para obtener el bloqueo
  try {
    lock.waitLock(600000); 
  } catch (e) {
    console.log('No se pudo obtener el bloqueo. Otra instancia podría estar ejecutándose.');
    return;
  }

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet();
    const tasksSheet = sheet.getSheetByName('Tasks');
    if (!tasksSheet) {
      console.log('No se encontró la hoja "Tasks".');
      return;
    }

    const allData = tasksSheet.getDataRange().getValues();
    const headers = allData[0];
    const tasks = allData.slice(1).map(row => {
      // Convertir fila en objeto de tarea
      const task = {};
      headers.forEach((header, i) => {
        task[header] = row[i];
      });
      return task;
    });

    const newGeneratedTasks = [];
    const parentTasks = tasks.filter(t => t.recurrence && t.status !== 'done');

    parentTasks.forEach(task => {
      let recurrence;
      try {
        recurrence = JSON.parse(task.recurrence);
      } catch (e) {
        console.log('Error al parsear la recurrencia para la tarea: ' + task.title);
        return; // Saltar esta tarea si la recurrencia es inválida
      }

      if (recurrence && recurrence.days && recurrence.days.length > 0) {
        const startDate = new Date(task.startDate);
        const endDate = new Date(task.dueDate);
        
        // Iterar desde la fecha de inicio hasta la fecha de fin de la recurrencia
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          const dayOfWeek = currentDate.getDay(); // 0=Dom, 1=Lun,...

          if (recurrence.days.includes(dayOfWeek)) {
            // Formatear la fecha a YYYY-MM-DD
            const dateStr = Utilities.formatDate(currentDate, Session.getScriptTimeZone(), 'yyyy-MM-dd');
            
            // Comprobar si ya existe una instancia para este día
            const exists = tasks.some(t => t.parentTaskId === task.id && t.dueDate === dateStr) ||
                           newGeneratedTasks.some(t => t.parentTaskId === task.id && t.dueDate === dateStr);

            if (!exists) {
              const newId = 't' + new Date().getTime() + '_' + Math.random().toString(36).substr(2, 9);
              
              const newTask = [
                newId,                      // id
                `${task.title} (${dateStr})`, // title
                task.description || '',     // description
                'todo',                     // status
                task.priority || 'medium',  // priority
                task.assigneeId || '',      // assigneeId
                dateStr,                    // startDate
                dateStr,                    // dueDate
                task.tags || '',            // tags
                task.assigneeIds || '',     // assigneeIds
                task.clientId || '',        // clientId
                '',                         // completedDate
                '',                         // recurrence (las instancias no son recurrentes)
                task.id                     // parentTaskId
              ];
              newGeneratedTasks.push(newTask);
            }
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    });

    if (newGeneratedTasks.length > 0) {
      // Añadir todas las nuevas tareas a la hoja de una sola vez
      tasksSheet.getRange(tasksSheet.getLastRow() + 1, 1, newGeneratedTasks.length, newGeneratedTasks[0].length).setValues(newGeneratedTasks);
      console.log(`Se generaron ${newGeneratedTasks.length} nuevas tareas recurrentes.`);
    } else {
      console.log('No se generaron nuevas tareas recurrentes.');
    }

  } catch (e) {
    console.error('Error durante la ejecución de processRecurringTasks: ' + e.toString());
  } finally {
    // Liberar el bloqueo para que otras ejecuciones puedan continuar
    lock.releaseLock();
  }
}

/**
 * Crea un trigger para ejecutar `processRecurringTasks` todos los días.
 * Ejecutar esta función una vez manualmente para configurar el trigger.
 */
function createDailyTrigger() {
  // Eliminar triggers antiguos para evitar duplicados
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'processRecurringTasks') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }

  // Crear un nuevo trigger que se ejecute cada día
  ScriptApp.newTrigger('processRecurringTasks')
    .timeBased()
    .everyDays(1)
    .atHour(1) // Ejecutar a la 1 AM, por ejemplo
    .create();
  
  console.log('Trigger diario para "processRecurringTasks" creado/actualizado.');
}
