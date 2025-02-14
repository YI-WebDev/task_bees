import React, { useState } from "react";
import { Paper } from "../atoms/Paper";
import { Box } from "../atoms/Box";
import { Typography } from "../atoms/Typography";
import { TaskCard } from "../molecules/TaskCard";
import { EditTaskModal } from "../molecules/EditTaskModal";
import { deleteTask } from "../services/boardService";
import { Column as ColumnType, Task } from "../../types/types";
import { IconButton } from "../atoms/IconButton";
import { Menu } from "../atoms/Menu";
import { MenuItem } from "../atoms/MenuItem";
import { MoreVertical, Edit, Trash2, Plus } from "lucide-react";
import { DeleteConfirmationModal } from "../molecules/DeleteConfirmationModal";
import { Button } from "../atoms/Button";
import { CreateTaskModal } from "../molecules/CreateTaskModal";

interface ColumnProps {
  column: ColumnType;
  onDragStart: (
    e: React.DragEvent,
    taskId: string,
    sourceColumnId: string,
    currentIndex: number
  ) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, columnId: string, dropIndex: number) => void;
  onTaskDeleted: () => void;
  onEditColumn: () => void;
  onDeleteColumn: () => void;
  onCreateTask: (data: { title: string; description: string; columnId: string }) => Promise<void>;
}

export const Column: React.FC<ColumnProps> = ({
  column,
  onDragStart,
  onDragOver,
  onDrop,
  onTaskDeleted,
  onEditColumn,
  onDeleteColumn,
  onCreateTask,
}) => {
  const [dropTarget, setDropTarget] = useState<{
    index: number;
    position: "top" | "bottom";
  } | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>(column.tasks);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

  React.useEffect(() => {
    setTasks(column.tasks);
  }, [column.tasks]);

  const handleDeleteTask = async (taskId: string) => {
    try {
      setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));

      await deleteTask(taskId);

      onTaskDeleted();
    } catch (error) {
      console.error("Failed to delete task:", error);
      setTasks(column.tasks);
    }
  };

  const handleColumnDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver(e);

    const columnRect = e.currentTarget.getBoundingClientRect();
    const mouseY = e.clientY - columnRect.top;

    if (tasks.length === 0) {
      setDropTarget(null);
      return;
    }

    const taskElements = e.currentTarget.getElementsByClassName("task-card");
    let closestIndex = 0;
    let closestDistance = Infinity;
    let position: "top" | "bottom" = "top";

    Array.from(taskElements).forEach((taskElement, index) => {
      const rect = taskElement.getBoundingClientRect();
      const taskTop = rect.top - columnRect.top;
      const taskBottom = taskTop + rect.height;
      const taskMiddle = taskTop + rect.height / 2;

      const distanceToTop = Math.abs(mouseY - taskTop);
      const distanceToBottom = Math.abs(mouseY - taskBottom);

      if (distanceToTop < closestDistance) {
        closestDistance = distanceToTop;
        closestIndex = index;
        position = "top";
      }

      if (distanceToBottom < closestDistance) {
        closestDistance = distanceToBottom;
        closestIndex = index;
        position = "bottom";
      }

      if (mouseY > taskMiddle && index === tasks.length - 1) {
        closestIndex = tasks.length - 1;
        position = "bottom";
      }
    });

    setDropTarget({ index: closestIndex, position });
  };

  const handleColumnDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!dropTarget && tasks.length === 0) {
      onDrop(e, column.id, 0);
      return;
    }

    if (!dropTarget) return;

    const dropIndex =
      dropTarget.position === "bottom" ? dropTarget.index + 1 : dropTarget.index;
    onDrop(e, column.id, dropIndex);
    setDropTarget(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleEditClick = () => {
    handleMenuClose();
    onEditColumn();
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      await onDeleteColumn();
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirmation(false);
    }
  };

  return (
    <>
      <Paper
        elevation={2}
        sx={{
          width: 300,
          backgroundColor: "white",
          p: 2,
          display: "flex",
          flexDirection: "column",
          borderTop: `4px solid ${column.color}`,
          position: "relative",
        }}
        onDragOver={handleColumnDragOver}
        onDrop={handleColumnDrop}
        onDragLeave={() => setDropTarget(null)}
      >
        <Box className="flex items-center justify-between mb-4">
          <Box className="flex items-center gap-2">
            <Typography variant="h6" className="font-semibold" style={{ color: column.color }}>
              {column.title}
            </Typography>
            <Box
              className="px-2 py-0.5 rounded text-xs font-medium"
              sx={{ backgroundColor: `${column.color}20`, color: column.color }}
            >
              {tasks.length}
            </Box>
          </Box>
          <IconButton
            onClick={handleMenuOpen}
            size="small"
            className="text-gray-400 hover:text-gray-600"
          >
            <MoreVertical className="w-4 h-4" />
          </IconButton>
        </Box>

        <Box className="flex-1 space-y-2">
          {tasks.map((task: Task, index: number) => (
            <Box
              key={task.id}
              className="task-card"
              sx={{
                position: "relative",
                "&::before":
                  dropTarget?.index === index && dropTarget?.position === "top"
                    ? {
                        content: '""',
                        position: "absolute",
                        top: -8,
                        left: 0,
                        right: 0,
                        height: 2,
                        backgroundColor: column.color,
                        borderRadius: 1,
                      }
                    : undefined,
                "&::after":
                  dropTarget?.index === index && dropTarget?.position === "bottom"
                    ? {
                        content: '""',
                        position: "absolute",
                        bottom: -8,
                        left: 0,
                        right: 0,
                        height: 2,
                        backgroundColor: column.color,
                        borderRadius: 1,
                      }
                    : undefined,
              }}
            >
              <TaskCard
                task={task}
                onDragStart={e => onDragStart(e, task.id, column.id, index)}
                onEdit={() => setEditingTask(task)}
                onDelete={() => handleDeleteTask(task.id)}
              />
            </Box>
          ))}
        </Box>
        <Button
          onClick={() => setIsCreateTaskModalOpen(true)}
          variant="secondary"
          icon={<Plus className="w-4 h-4" />}
          className="mt-4 w-full border-dashed border-2 border-amber-200 hover:border-amber-300 hover:bg-amber-50"
        >
          Add Task
        </Button>
      </Paper>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={handleEditClick}
          sx={{
            color: "warning.dark",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Edit size={16} />
          Edit Column
        </MenuItem>
        <MenuItem
          onClick={handleDeleteClick}
          sx={{
            color: "error.main",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Trash2 size={16} />
          Delete Column
        </MenuItem>
      </Menu>

      {editingTask && (
        <EditTaskModal
          open={!!editingTask}
          onClose={() => setEditingTask(null)}
          onTaskUpdated={onTaskDeleted}
          task={editingTask}
        />
      )}

      <DeleteConfirmationModal
        open={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Column"
        message={`Are you sure you want to delete "${column.title}"? All tasks in this column will be permanently deleted. This action cannot be undone.`}
        loading={deleteLoading}
      />

      <CreateTaskModal
        open={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        onSubmit={onCreateTask}
        columnId={column.id}
        columnTitle={column.title}
      />
    </>
  );
};