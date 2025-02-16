import React, { useState } from "react";
import { Card } from "../atoms/Card";
import { Box } from "../atoms/Box";
import { IconButton } from "../atoms/IconButton";
import { Menu } from "../atoms/Menu";
import { MenuItem } from "../atoms/MenuItem";
import { Clock, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Typography } from "../atoms/Typography";
import { Task } from "../../types/types";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onDragStart, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleClose();
    onEdit();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleClose();
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      await onDelete();
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirmation(false);
    }
  };

  return (
    <>
      <Card
        draggable
        onDragStart={onDragStart}
        className="cursor-move hover:shadow-lg transition-shadow duration-200 border border-amber-100"
      >
        <Box className="p-2">
          <Box className="flex justify-between items-start">
            <Typography variant="h6" className="mb-2">
              {task.title}
            </Typography>
            <IconButton
              onClick={handleClick}
              size="small"
              className="text-amber-500 hover:bg-amber-100"
            >
              <MoreVertical size={16} />
            </IconButton>
          </Box>
          <Typography variant="body2" className="mb-2 text-gray-600">
            {task.description}
          </Typography>
          <Box className="flex items-center text-amber-500">
            <Clock size={12} className="mr-1" />
            <Typography variant="caption">
              {new Date(task.created_at).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={e => e.stopPropagation()}
        >
          <MenuItem
            onClick={handleEdit}
            sx={{
              color: "primary.dark",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Edit size={16} className="mr-2" />
            Edit
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
            <Trash2 size={16} className="mr-2" />
            Delete
          </MenuItem>
        </Menu>
      </Card>

      <DeleteConfirmationModal
        open={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        loading={deleteLoading}
      />
    </>
  );
};
