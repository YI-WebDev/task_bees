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
      sx={{
        minHeight: 100,
        border: "2px dashed",
        borderColor: "primary.light",
        borderRadius: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <Typography variant="body2" color="text.secondary">
        Drop tasks here
      </Typography>
    </Box>
  );
};
