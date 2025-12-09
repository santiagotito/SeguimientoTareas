import React from 'react';
import { Task, User } from '../types';
import { Calendar } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  users: User[];
  onDragStart: (e: React.DragEvent, id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, users, onDragStart }) => {
  const priorityColors = {
    low: 'bg-slate-100 text-slate-600',
    medium: 'bg-blue-100 text-blue-600',
    high: 'bg-orange-100 text-orange-600',
    critical: 'bg-red-100 text-red-600'
  };

  const assignees = users.filter(u => task.assigneeIds?.includes(u.id) || u.id === task.assigneeId);
  
  // Comparar fechas en formato YYYY-MM-DD (sin conversión a Date para evitar zona horaria)
  const today = new Date().toISOString().split('T')[0]; // "2025-12-09"
  const isOverdue = task.status !== 'done' && task.dueDate < today;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className={`bg-white p-4 rounded-lg shadow-sm border-2 cursor-move hover:shadow-md transition-all active:cursor-grabbing ${
        isOverdue ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
      }`}
    >
      {isOverdue && (
        <div className="flex items-center gap-1 text-red-600 text-xs font-bold mb-2 bg-red-100 px-2 py-1 rounded">
          <span>⚠️ VENCIDA</span>
        </div>
      )}
      
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        {assignees.length > 0 && (
          <div className="flex -space-x-2">
            {assignees.slice(0, 3).map(assignee => (
              <img 
                key={assignee.id}
                src={assignee.avatar} 
                alt={assignee.name} 
                className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                title={assignee.name}
              />
            ))}
            {assignees.length > 3 && (
              <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                +{assignees.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
      
      <h4 className="font-semibold text-gray-800 text-sm mb-1 leading-tight">{task.title}</h4>
      <p className="text-xs text-gray-500 line-clamp-2 mb-3">{task.description}</p>
      
      <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-50 mt-2">
        <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-semibold' : ''}`}>
          <Calendar size={12} />
          <span>{(() => {
            // Formatear fecha directamente desde string YYYY-MM-DD sin conversión
            const [year, month, day] = task.dueDate.split('T')[0].split('-');
            return `${parseInt(day)}/${parseInt(month)}/${year}`;
          })()}</span>
        </div>
        {task.tags.length > 0 && (
          <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">
            {task.tags[0]}
          </span>
        )}
      </div>
    </div>
  );
};
