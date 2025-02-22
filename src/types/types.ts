export interface Task {
  id: string;
  title: string;
  description: string;
  position: number;
  created_by: Date;
  created_at: Date;
  is_completed: boolean;
}

export interface List {
  id: string;
  title: string;
  board_id: string;
  position: number;
  created_at: Date;
  color: string;
  tasks: Task[];
}

export interface Board {
  id: string;
  name: string;
  workspace_id: string;
  created_at: Date;
  position: number;
  total_tasks: number;
  completed_tasks: number;
}

export interface Workspace {
  id: string;
  name: string;
  created_at: Date;
  owner_id: string;
}
