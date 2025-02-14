import { supabase } from "../lib/supabase";
import type { Board, Column, Task } from "../../types/types";

interface BoardWithCounts extends Board {
  total_tasks: number;
  completed_tasks: number;
}

export async function getBoards() {
  const { data: boardsData, error: boardsError } = await supabase
    .from("boards")
    .select(
      `
      *,
      columns (
        id,
        tasks (
          id,
          is_completed
        )
      )
    `
    )
    .order("position");

  if (boardsError) throw boardsError;

  const boardsWithCounts: BoardWithCounts[] = boardsData.map(board => {
    const allTasks = board.columns?.flatMap((column: Column) => column.tasks) || [];
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter((task: Task) => task.is_completed).length;

    return {
      ...board,
      total_tasks: totalTasks,
      completed_tasks: completedTasks,
    };
  });

  return boardsWithCounts;
}

export async function createBoard({ name }: { name: string }) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  let workspace;
  const { data: existingWorkspaces, error: workspaceError } = await supabase
    .from("workspaces")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (workspaceError) throw workspaceError;

  if (!existingWorkspaces) {
    const { data: newWorkspace, error: createError } = await supabase
      .from("workspaces")
      .insert([
        {
          name: "My Workspace",
          owner_id: user.id,
        },
      ])
      .select()
      .single();

    if (createError) throw createError;
    workspace = newWorkspace;
  } else {
    workspace = existingWorkspaces;
  }

  const { data: board, error: boardError } = await supabase
    .from("boards")
    .insert([
      {
        name,
        workspace_id: workspace.id,
      },
    ])
    .select()
    .single();

  if (boardError) throw boardError;

  return board;
}

export async function createColumn({
  title,
  color,
  board_id,
}: {
  title: string;
  color: string;
  board_id: string;
}) {
  const { data: columns, error: positionError } = await supabase
    .from("columns")
    .select("position")
    .eq("board_id", board_id)
    .order("position", { ascending: false })
    .limit(1);

  if (positionError) throw positionError;

  const nextPosition = columns && columns.length > 0 ? columns[0].position + 1 : 0;

  const { data, error } = await supabase
    .from("columns")
    .insert([
      {
        title,
        color,
        board_id,
        position: nextPosition,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateColumn(
  columnId: string,
  updates: {
    title?: string;
    color?: string;
  }
) {
  const { data, error } = await supabase
    .from("columns")
    .update(updates)
    .eq("id", columnId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteColumn(columnId: string) {
  const { error } = await supabase.from("columns").delete().eq("id", columnId);

  if (error) throw error;
}

export async function updateBoard(boardId: string, updates: { name: string }) {
  const { data, error } = await supabase
    .from("boards")
    .update(updates)
    .eq("id", boardId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBoard(boardId: string) {
  const { error } = await supabase.from("boards").delete().eq("id", boardId);

  if (error) throw error;
}

export async function getColumns(boardId: string) {
  const { data, error } = await supabase
    .from("columns")
    .select("*")
    .eq("board_id", boardId)
    .order("position");

  if (error) throw error;
  return data;
}

export async function getTasks(columnId: string) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("column_id", columnId)
    .order("position");

  if (error) throw error;
  return data;
}

export async function updateTaskPositions(columnId: string, taskIds: string[]) {
  try {
    for (let i = 0; i < taskIds.length; i++) {
      const { error } = await supabase
        .from("tasks")
        .update({ position: i, column_id: columnId })
        .eq("id", taskIds[i]);

      if (error) {
        console.error("Error updating task position:", error);
        throw error;
      }
    }
  } catch (err) {
    console.error("Error in updateTaskPositions:", err);
    throw err;
  }
}

export async function createTask(taskData: {
  title: string;
  description: string;
  column_id: string;
  created_by: string;
}) {
  const { data: tasks, error: positionError } = await supabase
    .from("tasks")
    .select("position")
    .eq("column_id", taskData.column_id)
    .order("position", { ascending: false })
    .limit(1);

  if (positionError) throw positionError;

  const nextPosition = tasks && tasks.length > 0 ? tasks[0].position + 1 : 0;

  const { data, error } = await supabase
    .from("tasks")
    .insert([
      {
        ...taskData,
        position: nextPosition,
        is_completed: false,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating task:", error);
    throw error;
  }

  return data;
}

export async function updateTask(
  taskId: string,
  updates: {
    title?: string;
    description?: string;
    columnId?: string;
    is_completed?: boolean;
  }
) {
  const dbUpdates = {
    title: updates.title,
    description: updates.description,
    column_id: updates.columnId,
    is_completed: updates.is_completed,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("tasks")
    .update(dbUpdates)
    .eq("id", taskId)
    .select()
    .single();

  if (error) {
    console.error("Error updating task:", error);
    throw error;
  }

  return data;
}

export async function deleteTask(taskId: string) {
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);

  if (error) throw error;
}