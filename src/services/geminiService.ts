import { Task, User } from "../types";
import { getLocalDateString, formatLocalDate } from "../utils/dateUtils";

export const generateDailyReport = (tasks: Task[], users: User[]): string => {
  const todayFormatted = formatLocalDate(getLocalDateString());

  // Filtrar tareas pendientes (no "done")
  const pendingTasks = tasks.filter(t => t.status !== 'done');

  // Tareas vencidas (fecha límite pasada - comparación de strings YYYY-MM-DD)
  const todayString = getLocalDateString();
  const overdueTasks = pendingTasks.filter(t => t.dueDate < todayString);

  // Ordenar tareas por: prioridad (crítica>alta>media>baja) y fecha (más cercana primero)
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const sortedTasks = [...pendingTasks].sort((a, b) => {
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  // Agrupar por responsable
  const tasksByAssignee: Record<string, Task[]> = {};
  sortedTasks.forEach(task => {
    const assigneeIds = task.assigneeIds || (task.assigneeId ? [task.assigneeId] : []);
    if (assigneeIds.length === 0) {
      if (!tasksByAssignee['Sin Asignar']) tasksByAssignee['Sin Asignar'] = [];
      tasksByAssignee['Sin Asignar'].push(task);
    } else {
      assigneeIds.forEach(id => {
        const userName = users.find(u => u.id === id)?.name || 'Desconocido';
        if (!tasksByAssignee[userName]) tasksByAssignee[userName] = [];
        tasksByAssignee[userName].push(task);
      });
    }
  });

  // Construir reporte
  let report = `REPORTE DIARIO - TRÁFICO JMC\n`;
  report += `Fecha: ${todayFormatted}\n`;
  report += `═══════════════════════════════════════════════════════\n\n`;

  // Alertas de tareas vencidas
  if (overdueTasks.length > 0) {
    report += `⚠️ ALERTA: ${overdueTasks.length} TAREA(S) VENCIDA(S)\n`;
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    overdueTasks.forEach(task => {
      const assigneeNames = (task.assigneeIds || [])
        .map(id => users.find(u => u.id === id)?.name)
        .filter(Boolean)
        .join(', ') || users.find(u => u.id === task.assigneeId)?.name || 'Sin asignar';
      const daysOverdue = Math.floor((new Date(getLocalDateString()).getTime() - new Date(task.dueDate).getTime()) / (1000 * 60 * 60 * 24));
      const statusLabel = {
        todo: 'Por Hacer',
        inprogress: 'En Progreso',
        review: 'En Revisión',
        done: 'Finalizado'
      }[task.status];
      report += `  🔴 [${task.priority.toUpperCase()}] ${task.title}\n`;
      report += `     Responsable(s): ${assigneeNames}\n`;
      report += `     Vencida hace: ${daysOverdue} día(s)\n`;
      report += `     Estado: ${statusLabel}\n\n`;
    });
    report += `\n`;
  }

  // Resumen
  report += `📊 RESUMEN GENERAL\n`;
  report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  report += `Total de tareas pendientes: ${pendingTasks.length}\n`;
  report += `  • Críticas: ${pendingTasks.filter(t => t.priority === 'critical').length}\n`;
  report += `  • Altas: ${pendingTasks.filter(t => t.priority === 'high').length}\n`;
  report += `  • Medias: ${pendingTasks.filter(t => t.priority === 'medium').length}\n`;
  report += `  • Bajas: ${pendingTasks.filter(t => t.priority === 'low').length}\n\n`;

  // Tareas por responsable
  report += `📋 TAREAS POR RESPONSABLE\n`;
  report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  Object.entries(tasksByAssignee).forEach(([assignee, assigneeTasks]) => {
    report += `👤 ${assignee.toUpperCase()} (${assigneeTasks.length} tarea(s))\n`;
    report += `${'─'.repeat(50)}\n`;

    assigneeTasks.forEach((task, index) => {
      const isOverdue = task.dueDate < todayString;
      const dueDate = formatLocalDate(task.dueDate);
      const priorityEmoji = {
        critical: '🔥',
        high: '⚡',
        medium: '📌',
        low: '📝'
      }[task.priority];

      const statusLabel = {
        todo: 'Por Hacer',
        inprogress: 'En Progreso',
        review: 'En Revisión',
        done: 'Finalizado'
      }[task.status];

      report += `  ${index + 1}. ${priorityEmoji} [${task.priority.toUpperCase()}] ${task.title}\n`;
      report += `     Vence: ${dueDate}${isOverdue ? ' ⚠️ VENCIDA' : ''}\n`;
      report += `     Estado: ${statusLabel}\n`;
      if (task.description) {
        report += `     Descripción: ${task.description.substring(0, 80)}${task.description.length > 80 ? '...' : ''}\n`;
      }
      report += `\n`;
    });
    report += `\n`;
  });

  // Pie de reporte
  report += `═══════════════════════════════════════════════════════\n`;
  report += `Reporte generado automáticamente por Tráfico JMC\n`;

  return report;
};
