const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEETS_ID;
const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || '';

export const sheetsService = {
  async getUsers() {
    try {
      const range = 'Users!A:F';
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (!data.values || data.values.length <= 1) return [];
      
      const [headers, ...rows] = data.values;
      return rows.map(row => ({
        id: row[0] || '',
        name: row[1] || '',
        email: row[2] || '',
        password: row[3] || '',
        role: row[4] || 'Analyst',
        avatar: row[5] || 'https://picsum.photos/seed/default/200'
      }));
    } catch (error) {
      console.error('Error loading users from Sheets:', error);
      return [];
    }
  },

  async getTasks() {
    try {
      const range = 'Tasks!A:J';
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (!data.values || data.values.length <= 1) return [];
      
      const [headers, ...rows] = data.values;
      return rows.map(row => ({
        id: row[0] || '',
        title: row[1] || '',
        description: row[2] || '',
        status: row[3] || 'todo',
        priority: row[4] || 'medium',
        assigneeId: row[5] || null,
        startDate: row[6] || new Date().toISOString(),
        dueDate: row[7] || new Date().toISOString(),
        tags: row[8] ? row[8].split(',').map((t: string) => t.trim()) : [],
        assigneeIds: row[9] ? row[9].split(',').map((t: string) => t.trim()) : (row[5] ? [row[5]] : [])
      }));
    } catch (error) {
      console.error('Error loading tasks from Sheets:', error);
      return [];
    }
  },

  async saveTasks(tasks: any[]) {
    // Siempre guardar en localStorage como backup
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    // Intentar guardar en Sheets si hay URL de Apps Script
    if (!APPS_SCRIPT_URL) {
      console.warn('APPS_SCRIPT_URL no configurada. Solo guardando en localStorage.');
      return;
    }
    
    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tasks }),
        mode: 'no-cors' // Apps Script requiere esto
      });
      
      console.log('✅ Tareas guardadas en Google Sheets');
    } catch (error) {
      console.error('❌ Error guardando en Sheets:', error);
      console.log('Las tareas se guardaron solo en localStorage');
    }
  },

  async saveUsers(users: any[]) {
    // Guardar en localStorage como backup
    localStorage.setItem('users', JSON.stringify(users));
    
    // Intentar guardar en Sheets si hay URL de Apps Script
    if (!APPS_SCRIPT_URL) {
      console.warn('APPS_SCRIPT_URL no configurada. Solo guardando en localStorage.');
      return;
    }
    
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ users }),
        mode: 'no-cors'
      });
      
      console.log('✅ Usuarios guardados en Google Sheets');
    } catch (error) {
      console.error('❌ Error guardando usuarios en Sheets:', error);
      console.log('Los usuarios se guardaron solo en localStorage');
    }
  }
};
