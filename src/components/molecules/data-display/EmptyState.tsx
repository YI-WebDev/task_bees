import React from "react";
import { Box } from "../../atoms/Box";
import { Typography } from "../../atoms/Typography";
import { Button } from "../../atoms/Button";

interface EmptyStateProps {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <Box className="flex items-center justify-center w-full min-h-[300px] bg-white/50 rounded-lg border-2 border-dashed border-amber-200">
      <Box className="text-center p-6">
        {icon && <Box className="mb-4">{icon}</Box>}
        <Typography variant="h6" className="text-amber-800 mb-2">
          {title}
        </Typography>
        {message && (
          <Typography variant="body2" className="text-amber-600 mb-4">
            {message}
          </Typography>
        )}
        {actionLabel && onAction && (
          <Button onClick={onAction} className="bg-amber-500 text-white hover:bg-amber-600">
            {actionLabel}
          </Button>
        )}
      </Box>
    </Box>
  );
};
