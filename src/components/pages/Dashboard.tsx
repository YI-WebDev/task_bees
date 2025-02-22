import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { DashboardTemplate } from "../templates/DashboardTemplate";
import { List, Board } from "../../types/types";
import {
  getLists,
  getTasks,
  updateTaskPositions,
  createTask,
  deleteList,
  getBoards,
} from "../services/boardService";
import { useAuth } from "../contexts/AuthContext";
import { LoadingSpinner } from "../molecules/feedback/LoadingSpinner";
import { ErrorMessage } from "../molecules/feedback/ErrorMessage";
import { checkSupabaseConnection, handleSupabaseError } from "../lib/supabase";
import { InviteBoardModal } from "../molecules/InviteBoardModal";

export const Dashboard: React.FC = () => {
  const { boardId } = useParams();
  const [lists, setLists] = useState<List[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingBoards, setLoadingBoards] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const [draggedTask, setDraggedTask] = useState<{
    taskId: string;
    sourceColumnId: string;
    currentIndex: number;
  } | null>(null);

  const loadBoards = async () => {
    try {
      const boardsData = await getBoards();
      setBoards(boardsData);
    } catch (error) {
      console.error("Failed to load boards:", error);
      setError(handleSupabaseError(error));
    } finally {
      setLoadingBoards(false);
    }
  };

  const loadBoardData = useCallback(async () => {
    try {
      if (!boardId) {
        throw new Error("Board ID is required");
      }

      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        throw new Error("Unable to connect to the server. Please check your internet connection.");
      }

      const listsData = await getLists(boardId);

      const listsWithTasks = await Promise.all(
        listsData.map(async list => {
          const tasks = await getTasks(list.id);
          return {
            ...list,
            tasks: tasks.map(task => ({
              ...task,
              columnId: task.column_id,
              createdAt: new Date(task.created_at),
              updatedAt: new Date(task.updated_at || task.created_at),
            })),
          };
        })
      );

      setLists(listsWithTasks);
    } catch (err) {
      console.error("Error loading board data:", err);
      setError(handleSupabaseError(err));
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    if (user) {
      loadBoardData();
      loadBoards();
    }
  }, [user, loadBoardData]);

  const handleCreateTask = async (data: { title: string; description: string; listId: string }) => {
    if (!user) return;

    try {
      const newTask = await createTask({
        title: data.title,
        description: data.description,
        list_id: data.listId,
        created_by: user.id,
      });

      setLists(prevLists => {
        return prevLists.map(list => {
          if (list.id === data.listId) {
            return {
              ...list,
              tasks: [
                ...list.tasks,
                {
                  ...newTask,
                  listId: newTask.list_id,
                  createdAt: new Date(newTask.created_at),
                  updatedAt: new Date(newTask.updated_at || newTask.created_at),
                },
              ],
            };
          }
          return list;
        });
      });

      await loadBoards();
    } catch (error) {
      console.error("Failed to create task:", error);
      throw error;
    }
  };

  const handleDeleteList = async (listId: string) => {
    try {
      await deleteList(listId);
      await loadBoardData();
      await loadBoards();
    } catch (error) {
      console.error("Failed to delete list:", error);
      setError(handleSupabaseError(error));
    }
  };

  const handleDragStart = (
    _e: React.DragEvent,
    taskId: string,
    sourceColumnId: string,
    currentIndex: number
  ) => {
    setDraggedTask({ taskId, sourceColumnId, currentIndex });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetListId: string, dropIndex: number) => {
    e.preventDefault();

    if (!draggedTask) return;

    const { sourceColumnId, currentIndex } = draggedTask;

    try {
      setLists(prevLists => {
        const newLists = [...prevLists];
        const sourceList = newLists.find(list => list.id === sourceColumnId);
        const targetList = newLists.find(list => list.id === targetListId);

        if (!sourceList || !targetList) return prevLists;

        const taskToMove = sourceList.tasks[currentIndex];

        if (!taskToMove) return prevLists;

        sourceList.tasks = sourceList.tasks.filter((_, index) => index !== currentIndex);

        if (sourceColumnId === targetListId) {
          const adjustedDropIndex = dropIndex > currentIndex ? dropIndex - 1 : dropIndex;
          sourceList.tasks.splice(adjustedDropIndex, 0, taskToMove);

          const taskIds = sourceList.tasks.map(task => task.id);
          updateTaskPositions(taskIds, sourceColumnId).catch(console.error);
        } else {
          targetList.tasks.splice(dropIndex, 0, taskToMove);

          const sourceTaskIds = sourceList.tasks.map(task => task.id);
          const targetTaskIds = targetList.tasks.map(task => task.id);

          Promise.all([
            updateTaskPositions(sourceTaskIds, sourceColumnId),
            updateTaskPositions(targetTaskIds, targetListId),
          ]).catch(console.error);
        }

        return newLists;
      });

      await loadBoards();
    } catch (err) {
      console.error("Error updating task positions:", err);
      setError(handleSupabaseError(err));
    }

    setDraggedTask(null);
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return <ErrorMessage message={error} fullScreen showBackButton />;
  }

  return (
    <>
      <DashboardTemplate
        boardId={boardId!}
        lists={lists}
        boards={boards}
        loadingBoards={loadingBoards}
        isSidebarOpen={isSidebarOpen}
        onSidebarOpenChange={setIsSidebarOpen}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onCreateTask={handleCreateTask}
        onDeleteList={handleDeleteList}
        onBoardCreated={loadBoards}
        onListCreated={loadBoardData}
        onListUpdated={loadBoardData}
        onTaskDeleted={loadBoardData}
      />
      <InviteBoardModal
        open={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        boardId={boardId!}
      />
    </>
  );
};
