function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet();
    const data = JSON.parse(e.postData.contents);
    
    // NUEVO: Manejar operación específica (create, update, delete)
    if (data.operation) {
      return handleIncrementalOperation(sheet, data);
    }
    
    // LEGACY: Mantener compatibilidad con guardado completo
    if (data.tasks) {
      const tasksSheet = sheet.getSheetByName('Tasks');
      if (tasksSheet.getLastRow() > 1) {
        tasksSheet.deleteRows(2, tasksSheet.getLastRow() - 1);
      }
      if (tasksSheet.getLastRow() === 0) {
        tasksSheet.appendRow(['id', 'title', 'description', 'status', 'priority', 'assigneeId', 'startDate', 'dueDate', 'tags', 'assigneeIds', 'clientId']);
      }
      data.tasks.forEach(task => {
        tasksSheet.appendRow([
          task.id || '', task.title || '', task.description || '', task.status || 'todo',
          task.priority || 'medium', task.assigneeId || '', task.startDate || '',
          task.dueDate || '', (task.tags || []).join(','), (task.assigneeIds || []).join(','),
          task.clientId || ''
        ]);
      });
    }
    
    if (data.users) {
      const usersSheet = sheet.getSheetByName('Users');
      if (usersSheet.getLastRow() > 1) {
        usersSheet.deleteRows(2, usersSheet.getLastRow() - 1);
      }
      if (usersSheet.getLastRow() === 0) {
        usersSheet.appendRow(['id', 'name', 'email', 'password', 'role', 'avatar']);
      }
      data.users.forEach(user => {
        usersSheet.appendRow([
          user.id || '', user.name || '', user.email || '', user.password || '',
          user.role || 'Analyst', user.avatar || ''
        ]);
      });
    }
    
    if (data.clients) {
      let clientsSheet = sheet.getSheetByName('Clients');
      if (!clientsSheet) {
        clientsSheet = sheet.insertSheet('Clients');
      }
      if (clientsSheet.getLastRow() > 1) {
        clientsSheet.deleteRows(2, clientsSheet.getLastRow() - 1);
      }
      if (clientsSheet.getLastRow() === 0) {
        clientsSheet.appendRow(['id', 'name']);
      }
      data.clients.forEach(client => {
        clientsSheet.appendRow([client.id || '', client.name || '']);
      });
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// NUEVA FUNCIÓN: Operaciones incrementales
function handleIncrementalOperation(sheet, data) {
  const { operation, type, item } = data;
  
  if (type === 'task') {
    return handleTaskOperation(sheet, operation, item);
  } else if (type === 'client') {
    return handleClientOperation(sheet, operation, item);
  } else if (type === 'user') {
    return handleUserOperation(sheet, operation, item);
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({success: false, error: 'Unknown type'}))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleTaskOperation(sheet, operation, task) {
  const tasksSheet = sheet.getSheetByName('Tasks');
  
  if (operation === 'create') {
    tasksSheet.appendRow([
      task.id, task.title, task.description, task.status, task.priority,
      task.assigneeId || '', task.startDate, task.dueDate,
      (task.tags || []).join(','), (task.assigneeIds || []).join(','), task.clientId || ''
    ]);
  } else if (operation === 'update') {
    const data = tasksSheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === task.id) {
        tasksSheet.getRange(i + 1, 1, 1, 11).setValues([[
          task.id, task.title, task.description, task.status, task.priority,
          task.assigneeId || '', task.startDate, task.dueDate,
          (task.tags || []).join(','), (task.assigneeIds || []).join(','), task.clientId || ''
        ]]);
        break;
      }
    }
  } else if (operation === 'delete') {
    const data = tasksSheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === task.id) {
        tasksSheet.deleteRow(i + 1);
        break;
      }
    }
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({success: true}))
    .setMimeType(ContentService.MimeType.JSON);
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
  
  return ContentService
    .createTextOutput(JSON.stringify({success: true}))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleUserOperation(sheet, operation, user) {
  const usersSheet = sheet.getSheetByName('Users');
  
  if (operation === 'create') {
    usersSheet.appendRow([user.id, user.name, user.email, user.password || '', user.role, user.avatar]);
  } else if (operation === 'update') {
    const data = usersSheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === user.id) {
        usersSheet.getRange(i + 1, 1, 1, 6).setValues([[
          user.id, user.name, user.email, user.password || '', user.role, user.avatar
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
  
  return ContentService
    .createTextOutput(JSON.stringify({success: true}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({status: 'Apps Script activo'}))
    .setMimeType(ContentService.MimeType.JSON);
}
