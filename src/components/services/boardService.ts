import { supabase } from "../lib/supabase";
import type { Board, List, Task } from "../../types/types";
import { sendBoardInvitation } from './emailService';
import { generateToken } from '../../utils/tokenGenerator';
import type { User } from '@supabase/supabase-js';

interface BoardWithCounts extends Board {
  total_tasks: number;
  completed_tasks: number;
}

interface ProfileUpdateData {
  username?: string;
  email?: string;
  updated_at: string;
}

interface InvitationResult {
  success: boolean;
  error?: { message: string };
}

export async function getBoards() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  // Get all boards
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

  const { data: lastBoard } = await supabase
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

export const updateTaskPositions = async (taskIds: string[], listId: string) => {
  try {
    const updates = taskIds.map((taskId, index) => ({
      id: taskId,
      position: index,
      list_id: listId,
    }));

    for (const update of updates) {
      const { error } = await supabase
        .from("tasks")
        .update({ position: update.position, list_id: update.list_id })
        .eq("id", update.id);

      if (error) throw error;
    }
  } catch (error) {
    console.error("Error updating task positions:", error);
    throw error;
  }
};

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

export const deleteTask = async (taskId: string) => {
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);
  if (error) throw error;
};

export async function updateProfile(userId: string, data: ProfileUpdateData) {
  const { error: profileError } = await supabase.from("profiles").update(data).eq("id", userId);

  if (profileError) throw profileError;
}

export async function updateUserProfile(userId: string, username: string, email?: string) {
  const { error: updateError } = await supabase.auth.updateUser({
    data: { username },
    ...(email ? { email } : {}),
  });

  if (updateError) throw updateError;

  await updateProfile(userId, {
    username,
    ...(email ? { email } : {}),
    updated_at: new Date().toISOString(),
  });
}

export async function updateUserPassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

export const inviteUserToBoard = async (boardId: string, email: string, currentUser: User) => {
  try {
    const { data: boards, error: boardError } = await supabase
      .from('boards')
      .select('name')
      .eq('id', boardId);

    if (boardError) throw boardError;
    if (!boards || boards.length === 0) {
      throw new Error('Board not found');
    }

    const board = boards[0];
    const invitationToken = generateToken();
    
    const { error: inviteError } = await supabase
      .from('board_invitations')
      .insert({
        board_id: boardId,
        email: email,
        invitation_token: invitationToken,
        invited_by: currentUser.id,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

    if (inviteError) throw inviteError;

    const invitationResult = (await sendBoardInvitation({
      email,
      boardName: board.name,
      inviterName: currentUser.user_metadata.full_name || currentUser.email,
      boardId,
      invitationToken,
    }) || { success: false, error: { message: "Failed to send invitation" } }) as InvitationResult;

    if (!invitationResult.success) {
      await supabase
        .from('board_invitations')
        .delete()
        .eq('board_id', boardId)
        .eq('email', email);
      
      throw new Error(invitationResult.error?.message || 'Failed to send invitation email');
    }

    return { success: true };
  } catch (error) {
    console.error('Invitation Error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('An error occurred during the invitation process')
    };
  }
};

export const acceptBoardInvitation = async (boardId: string, token: string) => {
  try {
    const { data: invitation } = await supabase
      .from('board_invitations')
      .select('*')
      .eq('board_id', boardId)
      .eq('invitation_token', token)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (!invitation) {
      throw new Error('Invalid or expired invitation');
    }

    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      throw new Error('User not authenticated');
    }

    const { error: memberError } = await supabase
      .from('board_members')
      .insert({
        board_id: boardId,
        user_id: user.data.user.id,
        role: 'member',
      });

    if (memberError) {
      throw memberError;
    }

    await supabase
      .from('board_invitations')
      .delete()
      .eq('board_id', boardId)
      .eq('invitation_token', token);

    return { success: true };
  } catch (error) {
    console.error('Accept Invitation Error:', error);
    return { success: false, error };
  }
};
