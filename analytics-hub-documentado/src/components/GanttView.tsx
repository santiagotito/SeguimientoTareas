import React from 'react';
import { Task, User } from '../types';

interface GanttViewProps {
  tasks: Task[];
  users: User[];
}

const getDiffInDays = (date1: Date, date2: Date) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return Math.round((d1.getTime() - d2.getTime()) / oneDay);
};

const addDaysToDate = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};

export const GanttView: React.FC<GanttViewProps> = ({ tasks, users }) => {
  const sortedTasks = [...tasks].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  
  const minDate = sortedTasks.length 
    ? getStartOfWeek(new Date(sortedTasks[0].startDate)) 
    : new Date();
    
  const daysToShow = 30;
  const dates = Array.from({ length: daysToShow }, (_, i) => addDaysToDate(minDate, i));

  const getTaskStyle = (task: Task) => {
    const start = new Date(task.startDate);
    const offset = getDiffInDays(start, minDate);
    const duration = getDiffInDays(new Date(task.dueDate), start) + 1;
    
    const left = Math.max(0, offset);
    const width = Math.max(1, duration);
    
    const colors: Record<string, string> = {
      todo: '#e2e8f0',
      inprogress: '#3b82f6',
      review: '#f59e0b',
      done: '#10b981'
    };

    return {
      gridColumnStart: left + 2,
      gridColumnEnd: `span ${width}`,
      backgroundColor: colors[task.status],
    };
  };

  const formatDateDay = (date: Date) => new Intl.DateTimeFormat('es-ES', { day: '2-digit' }).format(date);
  const formatDateWeekday = (date: Date) => new Intl.DateTimeFormat('es-ES', { weekday: 'short' }).format(date).charAt(0);

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200 pb-4">
      <div className="min-w-[800px] p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Cronograma de Proyecto</h3>
        
        <div className="grid grid-cols-[200px_repeat(30,minmax(30px,1fr))] gap-0 mb-2 border-b border-gray-100 pb-2">
          <div className="font-semibold text-sm text-gray-500">Tarea</div>
          {dates.map((date, i) => (
            <div key={i} className="text-center text-[10px] text-gray-400 flex flex-col items-center">
              <span>{formatDateDay(date)}</span>
              <span className="text-[8px] uppercase">{formatDateWeekday(date)}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {tasks.map(task => {
             const assignee = users.find(u => u.id === task.assigneeId);
             return (
              <div key={task.id} className="grid grid-cols-[200px_repeat(30,minmax(30px,1fr))] gap-y-1 items-center hover:bg-gray-50">
                <div className="pr-4 py-1">
                  <div className="text-sm font-medium truncate" title={task.title}>{task.title}</div>
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    {assignee && <img src={assignee.avatar} className="w-4 h-4 rounded-full" alt={assignee.name}/>}
                    {assignee?.name.split(' ')[0]}
                  </div>
                </div>
                
                {getDiffInDays(new Date(task.dueDate), minDate) >= 0 && (
                  <div 
                    className="h-6 rounded-md shadow-sm relative group opacity-90 hover:opacity-100 transition-opacity"
                    style={getTaskStyle(task)}
                  >
                     <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis w-full px-1">
                       {task.status !== 'todo' && `${getDiffInDays(new Date(task.dueDate), new Date(task.startDate)) + 1}d`}
                     </span>
                  </div>
                )}
              </div>
             );
          })}
        </div>
        
        <div className="mt-6 flex gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-[#e2e8f0] rounded"></div> Por Hacer</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-[#3b82f6] rounded"></div> En Progreso</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-[#f59e0b] rounded"></div> Revisión</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-[#10b981] rounded"></div> Finalizado</div>
        </div>
      </div>
    </div>
  );
};
