function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet();
    const data = JSON.parse(e.postData.contents);
    
    // Manejar guardado de tareas
    if (data.tasks) {
      const tasksSheet = sheet.getSheetByName('Tasks');
      
      // Limpiar hoja (excepto headers)
      if (tasksSheet.getLastRow() > 1) {
        tasksSheet.deleteRows(2, tasksSheet.getLastRow() - 1);
      }
      
      // Si no hay headers, agregarlos
      if (tasksSheet.getLastRow() === 0) {
        tasksSheet.appendRow(['id', 'title', 'description', 'status', 'priority', 'assigneeId', 'startDate', 'dueDate', 'tags', 'assigneeIds']);
      }
      
      // Agregar tareas
      data.tasks.forEach(task => {
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
          (task.assigneeIds || []).join(',')
        ]);
      });
    }
    
    // Manejar guardado de usuarios
    if (data.users) {
      const usersSheet = sheet.getSheetByName('Users');
      
      // Limpiar hoja (excepto headers)
      if (usersSheet.getLastRow() > 1) {
        usersSheet.deleteRows(2, usersSheet.getLastRow() - 1);
      }
      
      // Si no hay headers, agregarlos
      if (usersSheet.getLastRow() === 0) {
        usersSheet.appendRow(['id', 'name', 'email', 'password', 'role', 'avatar']);
      }
      
      // Agregar usuarios
      data.users.forEach(user => {
        usersSheet.appendRow([
          user.id || '',
          user.name || '',
          user.email || '',
          user.password || '',
          user.role || 'Analyst',
          user.avatar || ''
        ]);
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

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({status: 'Apps Script activo'}))
    .setMimeType(ContentService.MimeType.JSON);
}
