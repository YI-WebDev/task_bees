import React from "react";
import { Box } from "../atoms/Box";
import { Typography } from "../atoms/Typography";

interface DropTargetProps {
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
}

export const DropTarget: React.FC<DropTargetProps> = ({ onDragOver, onDragLeave, onDrop }) => {
  return (
    <Box
      className="min-h-[100px] border-2 border-dashed border-amber-400 rounded flex items-center justify-center"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <Typography variant="body2" className="text-gray-500">
        Drop tasks here
      </Typography>
    </Box>
  );
};
