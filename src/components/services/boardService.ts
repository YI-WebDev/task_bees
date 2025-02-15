import { supabase } from "../lib/supabase";
import type { Board, List, Task } from "../../types/types";

interface BoardWithCounts extends Board {
  total_tasks: number;
  completed_tasks: number;
}

interface ProfileUpdateData {
  username?: string;
  email?: string;
  updated_at: string;
}

export async function getBoards() {
  const { data: boardsData, error: boardsError } = await supabase
    .from("boards")
    .select(
      `
      *,
      lists (
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
    const allTasks = board.lists?.flatMap((list: List) => list.tasks) || [];
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

  const { data: lastBoard, error: positionError } = await supabase
    .from("boards")
    .select("position")
    .eq("workspace_id", workspace.id)
    .order("position", { ascending: false })
    .limit(1)
    .single();

  const nextPosition = lastBoard ? lastBoard.position + 1 : 0;

  const { data: board, error: boardError } = await supabase
    .from("boards")
    .insert([
      {
        name,
        workspace_id: workspace.id,
        position: nextPosition,
      },
    ])
    .select()
    .single();

  if (boardError) throw boardError;

  return board;
}

export async function createList({
  title,
  color,
  board_id,
}: {
  title: string;
  color: string;
  board_id: string;
}) {
  const { data: lists, error: positionError } = await supabase
    .from("lists")
    .select("position")
    .eq("board_id", board_id)
    .order("position", { ascending: false })
    .limit(1);

  if (positionError) throw positionError;

  const nextPosition = lists && lists.length > 0 ? lists[0].position + 1 : 0;

  const { data, error } = await supabase
    .from("lists")
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

export async function updateList(
  listId: string,
  updates: {
    title?: string;
    color?: string;
  }
) {
  const { data, error } = await supabase
    .from("lists")
    .update(updates)
    .eq("id", listId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteList(listId: string) {
  const { error } = await supabase.from("lists").delete().eq("id", listId);

  if (error) throw error;
}

export async function updateBoard(boardId: string, updates: { name: string }) {
  const { data: currentBoard, error: fetchError } = await supabase
    .from("boards")
    .select("*")
    .eq("id", boardId)
    .single();

  if (fetchError) throw fetchError;

  const { data, error } = await supabase
    .from("boards")
    .update({ ...updates, position: currentBoard.position })
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

export async function getLists(boardId: string) {
  const { data, error } = await supabase
    .from("lists")
    .select("*")
    .eq("board_id", boardId)
    .order("position");

  if (error) throw error;
  return data;
}

export async function getTasks(listId: string) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("list_id", listId)
    .order("position");

  if (error) throw error;
  return data;
}

export async function updateTaskPositions(listId: string, taskIds: string[]) {
  try {
    for (let i = 0; i < taskIds.length; i++) {
      const { error } = await supabase
        .from("tasks")
        .update({ position: i, list_id: listId })
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
  list_id: string;
  created_by: string;
}) {
  const { data: tasks, error: positionError } = await supabase
    .from("tasks")
    .select("position")
    .eq("list_id", taskData.list_id)
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
    listId?: string;
    is_completed?: boolean;
  }
) {
  const dbUpdates = {
    title: updates.title,
    description: updates.description,
    list_id: updates.listId,
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

export async function updateProfile(userId: string, data: ProfileUpdateData) {
  const { error: profileError } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', userId);

  if (profileError) throw profileError;
}

export async function updateUserProfile(userId: string, username: string, email?: string) {
  try {
    const { error: updateError } = await supabase.auth.updateUser({
      data: { username },
      ...(email ? { email } : {})
    });

    if (updateError) throw updateError;

    await updateProfile(userId, {
      username,
      ...(email ? { email } : {}),
      updated_at: new Date().toISOString()
    });
  } catch (error) {
    throw error;
  }
}

export async function updateUserPassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}