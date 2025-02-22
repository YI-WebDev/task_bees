import React from "react";
import { Alert } from "../../atoms/Alert";
import { Box } from "../../atoms/Box";
import { Button } from "../../atoms/Button";
import { useNavigate } from "react-router-dom";

interface ErrorMessageProps {
  message: string;
  fullScreen?: boolean;
  showBackButton?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  fullScreen = false,
  showBackButton = false,
}) => {
  const navigate = useNavigate();

  if (fullScreen) {
    return (
      <Box className="min-h-screen bg-amber-50 flex flex-col items-center justify-center p-4">
        <Alert severity="error" className="mb-4 max-w-md">
          {message}
        </Alert>
        {showBackButton && (
          <Button variant="secondary" onClick={() => navigate("/boards")}>
            Back to Boards
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Alert severity="error" className="mb-4">
      {message}
    </Alert>
  );
};
