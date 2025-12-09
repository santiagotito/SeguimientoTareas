export type Status = 'todo' | 'inprogress' | 'review' | 'done';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  role: 'Manager' | 'Data Scientist' | 'Data Engineer' | 'Analyst';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assigneeId: string | null;
  assigneeIds: string[]; // Múltiples responsables
  startDate: string;
  dueDate: string;
  tags: string[];
}

export enum ViewMode {
  KANBAN = 'KANBAN',
  GANTT = 'GANTT',
  TEAM = 'TEAM',
  TEAM_MANAGEMENT = 'TEAM_MANAGEMENT'
}
