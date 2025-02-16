import React, { useState } from "react";
import { Paper } from "../atoms/Paper";
import { Box } from "../atoms/Box";
import { Typography } from "../atoms/Typography";
import { TaskCard } from "../molecules/TaskCard";
import { EditTaskModal } from "../molecules/EditTaskModal";
import { deleteTask } from "../services/boardService";
import { List as ListType, Task } from "../../types/types";
import { IconButton } from "../atoms/IconButton";
import { Menu } from "../atoms/Menu";
import { MenuItem } from "../atoms/MenuItem";
import { MoreVertical, Edit, Trash2, Plus } from "lucide-react";
import { DeleteConfirmationModal } from "../molecules/DeleteConfirmationModal";
import { Button } from "../atoms/Button";
import { CreateTaskModal } from "../molecules/CreateTaskModal";

interface ListProps {
  list: ListType;
  onDragStart: (
    e: React.DragEvent,
    taskId: string,
    sourceListId: string,
    currentIndex: number
  ) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, listId: string, dropIndex: number) => void;
  onTaskDeleted: () => void;
  onEditList: () => void;
  onDeleteList: () => void;
  onCreateTask: (data: { title: string; description: string; listId: string }) => Promise<void>;
}

export const List: React.FC<ListProps> = ({
  list,
  onDragStart,
  onDragOver,
  onDrop,
  onTaskDeleted,
  onEditList,
  onDeleteList,
  onCreateTask,
}) => {
  const [dropTarget, setDropTarget] = useState<{
    index: number;
    position: "top" | "bottom";
  } | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>(list.tasks);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

  React.useEffect(() => {
    setTasks(list.tasks);
  }, [list.tasks]);

  const handleDeleteTask = async (taskId: string) => {
    try {
      setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));

      await deleteTask(taskId);

      onTaskDeleted();
    } catch (error) {
      console.error("Failed to delete task:", error);
      setTasks(list.tasks);
    }
  };

  const handleListDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver(e);

    const listRect = e.currentTarget.getBoundingClientRect();
    const mouseY = e.clientY - listRect.top;

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
      const taskTop = rect.top - listRect.top;
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

  const handleListDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!dropTarget && tasks.length === 0) {
      onDrop(e, list.id, 0);
      return;
    }

    if (!dropTarget) return;

    const dropIndex = dropTarget.position === "bottom" ? dropTarget.index + 1 : dropTarget.index;
    onDrop(e, list.id, dropIndex);
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
    onEditList();
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      await onDeleteList();
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
          borderTop: `4px solid ${list.color}`,
          position: "relative",
        }}
        onDragOver={handleListDragOver}
        onDrop={handleListDrop}
        onDragLeave={() => setDropTarget(null)}
      >
        <Box className="flex items-center justify-between mb-4">
          <Box className="flex items-center gap-2">
            <Typography variant="h6" className="font-semibold" style={{ color: list.color }}>
              {list.title}
            </Typography>
            <Box
              className="px-2 py-0.5 rounded text-xs font-medium"
              sx={{ backgroundColor: `${list.color}20`, color: list.color }}
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
                        backgroundColor: list.color,
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
                        backgroundColor: list.color,
                        borderRadius: 1,
                      }
                    : undefined,
              }}
            >
              <TaskCard
                task={task}
                onDragStart={e => onDragStart(e, task.id, list.id, index)}
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

      <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
        <MenuItem
          onClick={handleEditClick}
          sx={{
            color: "primary.dark",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Edit size={16} />
          Edit List
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
          Delete List
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
        title="Delete List"
        message={`Are you sure you want to delete "${list.title}"? All tasks in this list will be permanently deleted. This action cannot be undone.`}
        loading={deleteLoading}
        type="column"
      />

      <CreateTaskModal
        open={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        onSubmit={onCreateTask}
        listId={list.id}
        listTitle={list.title}
      />
    </>
  );
};
