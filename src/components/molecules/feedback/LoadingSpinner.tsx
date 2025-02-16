import React from "react";
import { CircularProgress } from "../../atoms/CircularProgress";
import { Box } from "../../atoms/Box";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <Box className="min-h-screen bg-amber-50 flex items-center justify-center">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box className="flex items-center justify-center p-4">
      <CircularProgress color="primary" />
    </Box>
  );
};
