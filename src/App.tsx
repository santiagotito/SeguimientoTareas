import React, { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { TaskCard } from './components/TaskCard';
import { GanttView } from './components/GanttView';
import { Filters } from './components/Filters';
import { TeamManagement } from './components/TeamManagement';
import { User, Task, Status, ViewMode, Priority } from './types';
import { MOCK_USERS, STATUS_LABELS, STATUS_COLORS } from './constants';
import { generateDailyReport } from './services/geminiService';
import { sheetsService } from './services/sheetsService';
import { 
  LayoutDashboard, 
  CalendarRange, 
  Users, 
  Plus, 
  Sparkles, 
  LogOut,
  Mail,
  X,
  Edit,
  Trash2,
  Save
} from 'lucide-react';

// Helper para obtener fecha local en formato YYYY-MM-DD sin zona horaria
const getLocalDateString = (date?: Date | string | null): string => {
  let d: Date;
  
  if (!date) {
    d = new Date();
  } else if (typeof date === 'string') {
    // Si ya es YYYY-MM-DD, devolverlo tal cual
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
    // Si tiene hora, extraer solo la fecha
    if (date.includes('T')) {
      return date.split('T')[0];
    }
    d = new Date(date);
  } else {
    d = date;
  }
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

const INITIAL_TASKS: Task[] = [];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.KANBAN);
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [emailDraft, setEmailDraft] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  // Filtros
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [loadedTasks, loadedUsers] = await Promise.all([
        sheetsService.getTasks(),
        sheetsService.getUsers()
      ]);
      
      if (loadedUsers.length > 0) {
        setUsers(loadedUsers);
      }
      
      if (loadedTasks.length > 0) {
        const tasksWithAssigneeIds = loadedTasks.map(t => ({
          ...t,
          assigneeIds: t.assigneeIds || (t.assigneeId ? [t.assigneeId] : [])
        }));
        setTasks(tasksWithAssigneeIds);
      } else {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
          setTasks(JSON.parse(savedTasks));
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const saveTasks = async (newTasks: Task[]) => {
    setTasks(newTasks);
    await sheetsService.saveTasks(newTasks);
  };

  const handleUpdateUsers = async (newUsers: User[]) => {
    setUsers(newUsers);
    await sheetsService.saveUsers(newUsers);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: Status) => {
    e.preventDefault();
    if (draggingId) {
      const newTasks = tasks.map(t => 
        t.id === draggingId ? { ...t, status } : t
      );
      saveTasks(newTasks);
      setDraggingId(null);
    }
  };

  const handleGenerateReport = () => {
    setIsGeneratingEmail(true);
    const report = generateDailyReport(filteredTasks, users);
    setEmailDraft(report);
    setIsGeneratingEmail(false);
  };

  const handleCreateTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: `t${Date.now()}`,
      title: taskData.title || '',
      description: taskData.description || '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      assigneeId: taskData.assigneeIds?.[0] || null,
      assigneeIds: taskData.assigneeIds || [],
      startDate: getLocalDateString(taskData.startDate),
      dueDate: getLocalDateString(taskData.dueDate || new Date(Date.now() + 86400000 * 7)),
      tags: taskData.tags || []
    };
    saveTasks([...tasks, newTask]);
    setShowNewTaskModal(false);
  };

  const handleUpdateTask = (taskData: Task) => {
    const newTasks = tasks.map(t => t.id === taskData.id ? taskData : t);
    saveTasks(newTasks);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('¿Eliminar esta tarea?')) {
      saveTasks(tasks.filter(t => t.id !== taskId));
    }
  };

  // Filtros
  const handleStatusFilter = (status: Status) => {
    setSelectedStatuses(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const handlePriorityFilter = (priority: Priority) => {
    setSelectedPriorities(prev =>
      prev.includes(priority) ? prev.filter(p => p !== priority) : [...prev, priority]
    );
  };

  const handleAssigneeFilter = (userId: string) => {
    setSelectedAssignees(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleClearFilters = () => {
    setSelectedStatuses([]);
    setSelectedPriorities([]);
    setSelectedAssignees([]);
    setDateFrom('');
    setDateTo('');
  };

  // Aplicar filtros
  const filteredTasks = tasks.filter(task => {
    // Filtro por estado
    if (selectedStatuses.length > 0 && !selectedStatuses.includes(task.status)) {
      return false;
    }
    
    // Filtro por prioridad
    if (selectedPriorities.length > 0 && !selectedPriorities.includes(task.priority)) {
      return false;
    }
    
    // Filtro por responsable
    if (selectedAssignees.length > 0) {
      const hasAssignee = task.assigneeIds?.some(id => selectedAssignees.includes(id)) ||
                         (task.assigneeId && selectedAssignees.includes(task.assigneeId));
      if (!hasAssignee) return false;
    }
    
    // Filtro por fecha desde (comparación de strings YYYY-MM-DD)
    if (dateFrom && task.dueDate < dateFrom) {
      return false;
    }
    
    // Filtro por fecha hasta (comparación de strings YYYY-MM-DD)
    if (dateTo && task.dueDate > dateTo) {
      return false;
    }
    
    return true;
  });

  const tasksByStatus = {
    todo: filteredTasks.filter(t => t.status === 'todo'),
    inprogress: filteredTasks.filter(t => t.status === 'inprogress'),
    review: filteredTasks.filter(t => t.status === 'review'),
    done: filteredTasks.filter(t => t.status === 'done'),
  };

  const tasksByAssignee = users.map(user => ({
    user,
    tasks: filteredTasks.filter(t => t.assigneeIds?.includes(user.id) || t.assigneeId === user.id)
  }));
  const unassignedTasks = filteredTasks.filter(t => !t.assigneeId && (!t.assigneeIds || t.assigneeIds.length === 0));

  if (!currentUser) {
    return <Auth onLogin={setCurrentUser} />;
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-[#0078D4] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-900 font-sans">
      
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex z-10">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 text-[#0078D4] font-bold text-lg">
            <LayoutDashboard />
            <span>Tráfico Analítica RAM</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setViewMode(ViewMode.KANBAN)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${viewMode === ViewMode.KANBAN ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <LayoutDashboard size={18} />
            Tablero Kanban
          </button>
          <button 
            onClick={() => setViewMode(ViewMode.GANTT)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${viewMode === ViewMode.GANTT ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <CalendarRange size={18} />
            Cronograma (Gantt)
          </button>
          <button 
            onClick={() => setViewMode(ViewMode.TEAM)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${viewMode === ViewMode.TEAM ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Users size={18} />
            Equipo
          </button>
          
          <div className="pt-2 border-t border-gray-200 mt-2">
            <button 
              onClick={() => setViewMode(ViewMode.TEAM_MANAGEMENT)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${viewMode === ViewMode.TEAM_MANAGEMENT ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Users size={18} />
              Gestión de Equipo
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
            <h4 className="font-semibold text-indigo-900 text-sm mb-1">Reporte Diario</h4>
            <p className="text-xs text-indigo-700 mb-3">Genera el reporte de tareas pendientes.</p>
            <button 
              onClick={handleGenerateReport}
              disabled={isGeneratingEmail}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
            >
              {isGeneratingEmail ? (
                <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"/>
              ) : (
                <Mail size={14} />
              )}
              Generar Reporte
            </button>
          </div>
        </div>

        <div className="p-4 flex items-center gap-3 border-t border-gray-100">
          <img src={currentUser.avatar} alt="User" className="w-9 h-9 rounded-full object-cover" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-800 truncate">{currentUser.name}</p>
            <p className="text-xs text-gray-500 truncate">{currentUser.role}</p>
          </div>
          <button 
            onClick={() => setCurrentUser(null)}
            className="text-gray-400 hover:text-red-500 p-1"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        <div className="flex justify-between items-center px-8 py-5 bg-white border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {viewMode === ViewMode.KANBAN && 'Tablero de Tareas'}
              {viewMode === ViewMode.GANTT && 'Cronograma General'}
              {viewMode === ViewMode.TEAM && 'Carga de Trabajo del Equipo'}
              {viewMode === ViewMode.TEAM_MANAGEMENT && 'Gestión de Equipo'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Mostrando {filteredTasks.length} de {tasks.length} tareas
            </p>
          </div>
          <div className="flex items-center gap-4">
             {/* Alerta de tareas vencidas */}
             {(() => {
               const today = new Date().toISOString().split('T')[0];
               const overdueTasks = tasks.filter(t => 
                 t.status !== 'done' && t.dueDate < today
               );
               if (overdueTasks.length > 0) {
                 return (
                   <div className="bg-red-50 border border-red-200 px-4 py-2 rounded-lg flex items-center gap-2">
                     <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                     <span className="text-sm font-medium text-red-700">
                       {overdueTasks.length} tarea{overdueTasks.length > 1 ? 's' : ''} vencida{overdueTasks.length > 1 ? 's' : ''}
                     </span>
                   </div>
                 );
               }
               return null;
             })()}
             <button 
               onClick={() => setShowNewTaskModal(true)}
               className="bg-[#0078D4] hover:bg-[#006cbd] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm"
             >
               <Plus size={18} />
               Nueva Tarea
             </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-8 relative">
          
          <Filters
            users={users}
            selectedStatuses={selectedStatuses}
            selectedPriorities={selectedPriorities}
            selectedAssignees={selectedAssignees}
            dateFrom={dateFrom}
            dateTo={dateTo}
            onStatusChange={handleStatusFilter}
            onPriorityChange={handlePriorityFilter}
            onAssigneeChange={handleAssigneeFilter}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
            onClearFilters={handleClearFilters}
          />

          {viewMode === ViewMode.KANBAN && (
            <div className="flex gap-6 h-full min-w-[1000px] overflow-x-auto pb-4">
              {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
                <div 
                  key={status} 
                  className="flex-1 min-w-[280px] flex flex-col h-full rounded-xl bg-gray-100/50"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, status as Status)}
                >
                  <div className={`p-4 rounded-t-xl border-b border-gray-200/50 flex justify-between items-center ${STATUS_COLORS[status].split(' ')[0]}`}>
                    <h3 className={`font-bold text-sm ${STATUS_COLORS[status].split(' ')[1]}`}>
                      {STATUS_LABELS[status]}
                    </h3>
                    <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs font-bold text-gray-600">
                      {statusTasks.length}
                    </span>
                  </div>
                  <div className="p-3 flex-1 overflow-y-auto space-y-3">
                    {statusTasks.map(task => (
                      <div key={task.id} className="relative group">
                        <TaskCard 
                          task={task} 
                          users={users}
                          onDragStart={handleDragStart}
                        />
                        <div className="absolute top-2 right-2 hidden group-hover:flex gap-1 z-10">
                          <button
                            onClick={() => setEditingTask(task)}
                            className="bg-white p-1 rounded shadow hover:bg-blue-50"
                          >
                            <Edit size={14} className="text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="bg-white p-1 rounded shadow hover:bg-red-50"
                          >
                            <Trash2 size={14} className="text-red-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {statusTasks.length === 0 && (
                      <div className="h-24 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                        {selectedStatuses.length > 0 || selectedPriorities.length > 0 ? 'Sin tareas con estos filtros' : 'Arrastra tareas aquí'}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewMode === ViewMode.GANTT && (
            <GanttView tasks={filteredTasks} users={users} />
          )}

          {viewMode === ViewMode.TEAM && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasksByAssignee.map(({ user, tasks }) => (
                <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
                    <img src={user.avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt={user.name} />
                    <div>
                      <h3 className="font-bold text-gray-800">{user.name}</h3>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                    <div className="ml-auto bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
                      {tasks.length} tareas
                    </div>
                  </div>
                  <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto">
                    {tasks.length > 0 ? tasks.map(task => (
                      <div key={task.id} className="flex items-start gap-2 text-sm border-l-2 border-blue-500 pl-3 py-1">
                        <div className="flex-1">
                           <p className="font-medium text-gray-800 line-clamp-1">{task.title}</p>
                           <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                             task.status === 'done' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                           }`}>{STATUS_LABELS[task.status]}</span>
                        </div>
                      </div>
                    )) : (
                      <p className="text-sm text-gray-400 italic text-center py-4">Sin tareas asignadas</p>
                    )}
                  </div>
                </div>
              ))}
              
              {unassignedTasks.length > 0 && (
                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden border-dashed border-gray-300">
                   <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                       <Users className="text-gray-500" size={20} />
                     </div>
                     <h3 className="font-bold text-gray-600">Sin Asignar</h3>
                   </div>
                   <div className="p-4 space-y-3">
                      {unassignedTasks.map(task => (
                        <div key={task.id} className="opacity-75">
                           <p className="font-medium text-gray-800 text-sm">{task.title}</p>
                        </div>
                      ))}
                   </div>
                 </div>
              )}
            </div>
          )}

          {viewMode === ViewMode.TEAM_MANAGEMENT && (
            <TeamManagement users={users} onUpdateUsers={handleUpdateUsers} />
          )}

        </div>
        
        {emailDraft && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Reporte Diario de Tareas</h2>
                    <p className="text-sm text-gray-500">Tráfico Analítica RAM</p>
                  </div>
                </div>
                <button 
                  onClick={() => setEmailDraft(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50 font-mono text-sm leading-relaxed whitespace-pre-wrap text-gray-700">
                {emailDraft}
              </div>
              
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white rounded-b-2xl">
                <button 
                  onClick={() => setEmailDraft(null)}
                  className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <a 
                  href={`mailto:team@analytics.com?subject=Reporte Diario - Analytics&body=${encodeURIComponent(emailDraft)}`}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all"
                >
                  <Mail size={18} />
                  Abrir en Correo
                </a>
              </div>
            </div>
          </div>
        )}

        {(showNewTaskModal || editingTask) && (
          <TaskModal
            task={editingTask}
            users={users}
            onSave={editingTask ? handleUpdateTask : handleCreateTask}
            onClose={() => {
              setShowNewTaskModal(false);
              setEditingTask(null);
            }}
          />
        )}

      </main>
    </div>
  );
};

const TaskModal: React.FC<{
  task?: Task | null;
  users: User[];
  onSave: (task: any) => void;
  onClose: () => void;
}> = ({ task, users, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'todo',
    priority: task?.priority || 'medium',
    assigneeIds: task?.assigneeIds || [],
    startDate: getLocalDateString(task?.startDate),
    dueDate: getLocalDateString(task?.dueDate || new Date(Date.now() + 86400000 * 7)),
    tags: task?.tags?.join(', ') || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...task,
      ...formData,
      assigneeId: formData.assigneeIds[0] || null,
      startDate: getLocalDateString(formData.startDate),
      dueDate: getLocalDateString(formData.dueDate),
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    });
  };

  const toggleAssignee = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      assigneeIds: prev.assigneeIds.includes(userId)
        ? prev.assigneeIds.filter(id => id !== userId)
        : [...prev.assigneeIds, userId]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-bold">{task ? 'Editar Tarea' : 'Nueva Tarea'}</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input
            type="text"
            placeholder="Título"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
          />
          
          <textarea
            placeholder="Descripción"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value as Status})}
              className="px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="todo">Por Hacer</option>
              <option value="inprogress">En Progreso</option>
              <option value="review">En Revisión</option>
              <option value="done">Finalizado</option>
            </select>
            
            <select
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value as Priority})}
              className="px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
              <option value="critical">Crítica</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Responsables ({formData.assigneeIds.length} seleccionados)
            </label>
            <div className="border rounded p-3 space-y-2 max-h-40 overflow-y-auto">
              {users.map(user => (
                <label key={user.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                  <input
                    type="checkbox"
                    checked={formData.assigneeIds.includes(user.id)}
                    onChange={() => toggleAssignee(user.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <img src={user.avatar} className="w-6 h-6 rounded-full" alt={user.name} />
                  <span className="text-sm text-gray-700">{user.name}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Fecha inicio</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Fecha vencimiento</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <input
            type="text"
            placeholder="Tags (separados por coma)"
            value={formData.tags}
            onChange={(e) => setFormData({...formData, tags: e.target.value})}
            className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
          
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#0078D4] text-white rounded hover:bg-[#006cbd] flex items-center gap-2"
            >
              <Save size={18} />
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;
