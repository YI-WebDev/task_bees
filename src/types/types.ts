export interface Task {
  id: string;
  title: string;
  description: string;
  position: number;
  created_by: string;
  is_completed: boolean;
}

export interface Column {
  id: string;
  title: string;
  board_id: string;
  position: number;
  created_at: string;
  color: string;
  tasks: Task[];
}

export interface Board {
  id: string;
  name: string;
  workspace_id: string;
  created_at: string;
  position: number;
  total_tasks: number;
  completed_tasks: number;
}

export interface Workspace {
  id: string;
  name: string;
  created_at: string;
  owner_id: string;
}