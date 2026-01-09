import React, { useMemo } from 'react';
import { Task, User, Status, Priority } from '../types';
import {
    BarChart3,
    CheckCircle2,
    AlertCircle,
    Clock,
    Briefcase,
    TrendingUp,
    User as UserIcon,
    Layout
} from 'lucide-react';

interface DashboardProps {
    tasks: Task[];
    contextTasks: Task[]; // Tareas sin filtro de estado (para cálculos globales)
    users: User[];
}

export const Dashboard: React.FC<DashboardProps> = ({ tasks, contextTasks, users }) => {
    // --- KPI Calculation (Completion Rate uses contextTasks) ---
    const stats = useMemo(() => {
        // Pending/Critical/High based on CURRENT VIEW (tasks)
        const totalVisible = tasks.length;
        const pending = tasks.filter(t => t.status !== 'done').length;
        const critical = tasks.filter(t => t.priority === 'critical' && t.status !== 'done').length;
        const high = tasks.filter(t => t.priority === 'high' && t.status !== 'done').length;

        // Completion Rate based on CONTEXT (contextTasks - ignoring status filter)
        const contextTotal = contextTasks.length;
        const contextCompleted = contextTasks.filter(t => t.status === 'done').length;
        const completionRate = contextTotal > 0 ? Math.round((contextCompleted / contextTotal) * 100) : 0;

        return {
            total: totalVisible,
            pending,
            critical,
            high,
            completionRate
        };
    }, [tasks, contextTasks]);

    // --- Breakdown by Priority (Active Tasks) ---
    const priorityBreakdown = useMemo(() => {
        const active = tasks.filter(t => t.status !== 'done');
        const counts = {
            critical: active.filter(t => t.priority === 'critical').length,
            high: active.filter(t => t.priority === 'high').length,
            medium: active.filter(t => t.priority === 'medium').length,
            low: active.filter(t => t.priority === 'low').length,
        };
        return counts;
    }, [tasks]);

    // --- Breakdown by Status ---
    const statusBreakdown = useMemo(() => {
        const counts = {
            todo: tasks.filter(t => t.status === 'todo').length,
            inprogress: tasks.filter(t => t.status === 'inprogress').length,
            review: tasks.filter(t => t.status === 'review').length,
            done: tasks.filter(t => t.status === 'done').length,
        };
        return counts;
    }, [tasks]);

    // --- Top Users by Workload (Pending Tasks) ---
    const userWorkload = useMemo(() => {
        const activeTasks = tasks.filter(t => t.status !== 'done');
        const workload = users.map(user => {
            const count = activeTasks.filter(t =>
                t.assigneeIds?.includes(user.id) || t.assigneeId === user.id
            ).length;
            return { user, count };
        });
        // Sort by count desc and take top 5
        return workload.sort((a, b) => b.count - a.count).slice(0, 5);
    }, [tasks, users]);

    // --- Helper for progress bars ---
    const maxWorkload = Math.max(...userWorkload.map(w => w.count), 1);

    return (
        <div className="h-full overflow-y-auto p-2">
            <div className="max-w-[1600px] mx-auto space-y-6 pb-12">

                {/* Header Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Layout className="text-ram-blue" />
                        Dashboard General
                    </h2>
                    <p className="text-gray-500 mt-1">Visión general del estado del proyecto basada en los filtros actuales.</p>
                </div>

                {/* KPIs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Card 1: Total Pending */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
                        <div>
                            <p className="text-gray-500 text-sm font-medium mb-1">Tareas Pendientes</p>
                            <h3 className="text-3xl font-bold text-gray-800">{stats.pending}</h3>
                            <p className="text-xs text-gray-400 mt-1">De {stats.total} tareas visibles</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Clock size={24} />
                        </div>
                    </div>

                    {/* Card 2: Critical & High */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
                        <div>
                            <p className="text-gray-500 text-sm font-medium mb-1">Prioridad Alta/Crítica</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold text-gray-800">{stats.critical + stats.high}</h3>
                                <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                                    {stats.critical} Críticas
                                </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Requieren atención inmediata</p>
                        </div>
                        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <AlertCircle size={24} />
                        </div>
                    </div>

                    {/* Card 3: Completion Rate */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
                        <div>
                            <p className="text-gray-500 text-sm font-medium mb-1">Tasa de Finalización</p>
                            <h3 className="text-3xl font-bold text-gray-800">{stats.completionRate}%</h3>
                            <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                                <div
                                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                                    style={{ width: `${stats.completionRate}%` }}
                                />
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <CheckCircle2 size={24} />
                        </div>
                    </div>

                    {/* Card 4: Total Active Workload */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
                        <div>
                            <p className="text-gray-500 text-sm font-medium mb-1">Carga de Trabajo Activa</p>
                            <h3 className="text-3xl font-bold text-gray-800">{stats.pending}</h3>
                            <p className="text-xs text-gray-400 mt-1">Tareas en progreso o por hacer</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Briefcase size={24} />
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Priority Distribution */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1">
                        <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <AlertCircle size={18} className="text-gray-400" />
                            Distribución por Prioridad
                        </h3>

                        <div className="space-y-4">
                            <PriorityBar label="Crítica" count={priorityBreakdown.critical} color="bg-red-500" total={stats.pending} />
                            <PriorityBar label="Alta" count={priorityBreakdown.high} color="bg-orange-500" total={stats.pending} />
                            <PriorityBar label="Media" count={priorityBreakdown.medium} color="bg-blue-500" total={stats.pending} />
                            <PriorityBar label="Baja" count={priorityBreakdown.low} color="bg-green-500" total={stats.pending} />
                        </div>

                        {stats.pending === 0 && (
                            <div className="text-center py-8 text-gray-400 text-sm italic">
                                No hay tareas pendientes para mostrar.
                            </div>
                        )}
                    </div>

                    {/* Status Pipeline */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1">
                        <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <TrendingUp size={18} className="text-gray-400" />
                            Estado de Tareas
                        </h3>

                        <div className="flex flex-col gap-4">
                            {/* Todo */}
                            <div className="flex items-center gap-3">
                                <div className="w-24 text-sm font-medium text-gray-600">Por Hacer</div>
                                <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                                    <div
                                        className="h-full bg-slate-400 rounded-lg flex items-center justify-end px-2 transition-all duration-500"
                                        style={{ width: `${(statusBreakdown.todo / stats.total) * 100}%` }}
                                    >
                                        {statusBreakdown.todo > 0 && <span className="text-xs text-white font-bold">{statusBreakdown.todo}</span>}
                                    </div>
                                </div>
                            </div>

                            {/* In Progress */}
                            <div className="flex items-center gap-3">
                                <div className="w-24 text-sm font-medium text-gray-600">En Progreso</div>
                                <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                                    <div
                                        className="h-full bg-blue-500 rounded-lg flex items-center justify-end px-2 transition-all duration-500"
                                        style={{ width: `${(statusBreakdown.inprogress / stats.total) * 100}%` }}
                                    >
                                        {statusBreakdown.inprogress > 0 && <span className="text-xs text-white font-bold">{statusBreakdown.inprogress}</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Review */}
                            <div className="flex items-center gap-3">
                                <div className="w-24 text-sm font-medium text-gray-600">En Revisión</div>
                                <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                                    <div
                                        className="h-full bg-purple-500 rounded-lg flex items-center justify-end px-2 transition-all duration-500"
                                        style={{ width: `${(statusBreakdown.review / stats.total) * 100}%` }}
                                    >
                                        {statusBreakdown.review > 0 && <span className="text-xs text-white font-bold">{statusBreakdown.review}</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Done */}
                            <div className="flex items-center gap-3">
                                <div className="w-24 text-sm font-medium text-gray-600">Finalizado</div>
                                <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                                    <div
                                        className="h-full bg-green-500 rounded-lg flex items-center justify-end px-2 transition-all duration-500"
                                        style={{ width: `${(statusBreakdown.done / stats.total) * 100}%` }}
                                    >
                                        {statusBreakdown.done > 0 && <span className="text-xs text-white font-bold">{statusBreakdown.done}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top Users Workload */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1">
                        <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <UserIcon size={18} className="text-gray-400" />
                            Más Activos (Pendientes)
                        </h3>

                        <div className="space-y-4">
                            {userWorkload.map(({ user, count }) => (
                                <div key={user.id} className="flex items-center gap-3">
                                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full bg-gray-200 object-cover" />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-medium text-gray-700">{user.name.split(' ')[0]}</span>
                                            <span className="text-xs font-bold text-gray-500">{count}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-500 rounded-full"
                                                style={{ width: `${(count / maxWorkload) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {userWorkload.length === 0 && (
                                <div className="text-center py-8 text-gray-400 text-sm italic">
                                    No hay usuarios con tareas.
                                </div>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

// Helper Component for Priority Bar
const PriorityBar = ({ label, count, color, total }: { label: string, count: number, color: string, total: number }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;

    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">{label}</span>
                <span className="text-xs font-bold text-gray-700">{count}</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                    className={`h-full ${color} rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};
