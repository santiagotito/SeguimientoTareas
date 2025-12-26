import React, { useState } from 'react';
import { User, Status, Priority, Client } from '../types';
import { Filter, X, ChevronDown, ChevronUp, Search, AlertCircle } from 'lucide-react';

interface FiltersProps {
  users: User[];
  clients: Client[];
  selectedStatuses: Status[];
  selectedPriorities: Priority[];
  selectedAssignees: string[];
  selectedClients: string[];
  searchTaskName: string;
  dateFrom: string;
  dateTo: string;
  showOverdueOnly: boolean;
  showRecurringOnly: boolean;
  onStatusChange: (status: Status) => void;
  onPriorityChange: (priority: Priority) => void;
  onAssigneeChange: (userId: string) => void;
  onClientChange: (clientId: string) => void;
  onSearchChange: (search: string) => void;
  onDateFromChange: (date: string) => void;
  onDateToChange: (date: string) => void;
  onOverdueToggle: (value: boolean) => void;
  onRecurringToggle: (value: boolean) => void;
  onClearFilters: () => void;
}

export const Filters: React.FC<FiltersProps> = ({
  users,
  clients,
  selectedStatuses,
  selectedPriorities,
  selectedAssignees,
  selectedClients,
  searchTaskName,
  dateFrom,
  dateTo,
  showOverdueOnly,
  showRecurringOnly,
  onStatusChange,
  onPriorityChange,
  onAssigneeChange,
  onClientChange,
  onSearchChange,
  onDateFromChange,
  onDateToChange,
  onOverdueToggle,
  onRecurringToggle,
  onClearFilters
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const statuses: Status[] = ['todo', 'inprogress', 'review', 'done'];
  const priorities: Priority[] = ['low', 'medium', 'high', 'critical'];
  
  const statusLabels = {
    todo: 'Por Hacer',
    inprogress: 'En Progreso',
    review: 'En Revisión',
    done: 'Finalizado'
  };
  
  const priorityLabels = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
    critical: 'Crítica'
  };

  const hasActiveFilters = selectedStatuses.length > 0 || 
                          selectedPriorities.length > 0 || 
                          selectedAssignees.length > 0 ||
                          selectedClients.length > 0 ||
                          searchTaskName.length > 0 ||
                          showOverdueOnly ||
                          showRecurringOnly ||
                          dateFrom || dateTo;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-600" />
          <h3 className="font-semibold text-gray-800">Filtros</h3>
          {hasActiveFilters && (
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
              Activos
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClearFilters();
              }}
              className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 px-2 py-1 hover:bg-red-50 rounded"
            >
              <X size={14} />
              Limpiar
            </button>
          )}
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {/* Estado */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Estado</label>
              <div className="space-y-1">
                {statuses.map(status => (
                  <label key={status} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input
                      type="checkbox"
                      checked={selectedStatuses.includes(status)}
                      onChange={() => onStatusChange(status)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{statusLabels[status]}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Prioridad */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Prioridad</label>
              <div className="space-y-1">
                {priorities.map(priority => (
                  <label key={priority} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input
                      type="checkbox"
                      checked={selectedPriorities.includes(priority)}
                      onChange={() => onPriorityChange(priority)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{priorityLabels[priority]}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Responsables */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Responsable</label>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {users.map(user => (
                  <label key={user.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input
                      type="checkbox"
                      checked={selectedAssignees.includes(user.id)}
                      onChange={() => onAssigneeChange(user.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{user.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Fechas */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Rango de Fechas</label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => onDateFromChange(e.target.value)}
                  className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Desde"
                />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => onDateToChange(e.target.value)}
                  className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Hasta"
                />
              </div>
            </div>
          </div>
          
          {/* NUEVA FILA: Búsqueda y Cliente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
            {/* Búsqueda por nombre */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Buscar Tarea</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTaskName}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Escribir nombre de tarea..."
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            {/* Cliente */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Cliente</label>
              <div className="space-y-1 max-h-32 overflow-y-auto border border-gray-200 rounded p-2">
                {clients.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No hay clientes</p>
                ) : (
                  clients.map(client => (
                    <label key={client.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={selectedClients.includes(client.id)}
                        onChange={() => onClientChange(client.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{client.name}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>
          
          {/* FILA EXTRA: Toggle Tareas Vencidas */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors">
              <input
                type="checkbox"
                checked={showOverdueOnly}
                onChange={(e) => onOverdueToggle(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <div className="flex items-center gap-2">
                <AlertCircle size={18} className="text-red-500" />
                <div>
                  <span className="text-sm font-semibold text-gray-800">Solo tareas vencidas</span>
                  <p className="text-xs text-gray-500">Mostrar únicamente tareas con fecha de vencimiento pasada</p>
                </div>
              </div>
            </label>

            {/* Filtro de tareas madre */}
            <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors">
              <input
                type="checkbox"
                checked={showRecurringOnly}
                onChange={(e) => onRecurringToggle(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="flex items-center gap-2">
                <svg className="w-[18px] h-[18px] text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <div>
                  <span className="text-sm font-semibold text-gray-800">Solo tareas madre</span>
                  <p className="text-xs text-gray-500">Mostrar únicamente tareas recurrentes (maestras)</p>
                </div>
              </div>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
