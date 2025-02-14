import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { DashboardTemplate } from "../templates/DashboardTemplate";
import { Column } from "../../types/types";
import { getColumns, getTasks, updateTaskPositions, createTask } from "../services/boardService";
import { useAuth } from "../contexts/AuthContext";
import { LoadingSpinner } from "../molecules/feedback/LoadingSpinner";
import { ErrorMessage } from "../molecules/feedback/ErrorMessage";
import { checkSupabaseConnection, handleSupabaseError } from "../lib/supabase";

export const Dashboard: React.FC = () => {
  const { boardId } = useParams();
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const [draggedTask, setDraggedTask] = useState<{
    taskId: string;
    sourceColumnId: string;
    currentIndex: number;
  } | null>(null);

  const loadBoardData = useCallback(async () => {
    try {
      if (!boardId) {
        throw new Error("Board ID is required");
      }

      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        throw new Error("Unable to connect to the server. Please check your internet connection.");
      }

      const columnsData = await getColumns(boardId);

      const columnsWithTasks = await Promise.all(
        columnsData.map(async column => {
          const tasks = await getTasks(column.id);
          return {
            ...column,
            tasks: tasks.map(task => ({
              ...task,
              columnId: task.column_id,
              createdAt: new Date(task.created_at),
              updatedAt: new Date(task.updated_at || task.created_at),
            })),
          };
        })
      );

      setColumns(columnsWithTasks);
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
    }
  }, [user, loadBoardData]);

  const handleCreateTask = async (data: {
    title: string;
    description: string;
    columnId: string;
  }) => {
    if (!user) return;

    try {
      const newTask = await createTask({
        title: data.title,
        description: data.description,
        column_id: data.columnId,
        created_by: user.id,
      });

      setColumns(prevColumns => {
        return prevColumns.map(column => {
          if (column.id === data.columnId) {
            return {
              ...column,
              tasks: [
                ...column.tasks,
                {
                  ...newTask,
                  columnId: newTask.column_id,
                  createdAt: new Date(newTask.created_at),
                  updatedAt: new Date(newTask.updated_at || newTask.created_at),
                },
              ],
            };
          }
          return column;
        });
      });
    } catch (error) {
      console.error("Failed to create task:", error);
      throw error;
    }
  };

  const handleDragStart = (
    e: React.DragEvent,
    taskId: string,
    sourceColumnId: string,
    currentIndex: number
  ) => {
    setDraggedTask({ taskId, sourceColumnId, currentIndex });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetColumnId: string, dropIndex: number) => {
    e.preventDefault();

    if (!draggedTask) return;

    const { sourceColumnId, currentIndex } = draggedTask;

    try {
      setColumns(prevColumns => {
        const newColumns = [...prevColumns];
        const sourceColumn = newColumns.find(col => col.id === sourceColumnId);
        const targetColumn = newColumns.find(col => col.id === targetColumnId);

        if (!sourceColumn || !targetColumn) return prevColumns;

        const taskToMove = sourceColumn.tasks[currentIndex];

        if (!taskToMove) return prevColumns;

        sourceColumn.tasks = sourceColumn.tasks.filter((_, index) => index !== currentIndex);

        if (sourceColumnId === targetColumnId) {
          const adjustedDropIndex = dropIndex > currentIndex ? dropIndex - 1 : dropIndex;
          sourceColumn.tasks.splice(adjustedDropIndex, 0, taskToMove);

          const taskIds = sourceColumn.tasks.map(task => task.id);
          updateTaskPositions(sourceColumnId, taskIds).catch(console.error);
        } else {
          targetColumn.tasks.splice(dropIndex, 0, taskToMove);

          const sourceTaskIds = sourceColumn.tasks.map(task => task.id);
          const targetTaskIds = targetColumn.tasks.map(task => task.id);

          Promise.all([
            updateTaskPositions(sourceColumnId, sourceTaskIds),
            updateTaskPositions(targetColumnId, targetTaskIds),
          ]).catch(console.error);
        }

        return newColumns;
      });
    } catch (err) {
      console.error("Error updating task positions:", err);
      setError("Failed to update task positions");
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
    <DashboardTemplate
      boardId={boardId!}
      columns={columns}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onCreateTask={handleCreateTask}
      onTaskDeleted={loadBoardData}
      onColumnCreated={loadBoardData}
      onColumnUpdated={loadBoardData}
      onColumnDeleted={loadBoardData}
    />
  );
};