import React from "react";
import { Dialog, DialogContent, Box } from "@mui/material";
import { Button } from "../atoms/Button";
import { Typography } from "../atoms/Typography";

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  loading?: boolean;
  type?: "board" | "task" | "column";
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  message,
  loading = false,
  type = "task",
}) => {
  const getTip = () => {
    switch (type) {
      case "board":
        return "Consider exporting or backing up your board data before deletion! 🍯";
      case "column":
        return "Consider moving important tasks to another column before deletion! 🍯";
      case "task":
      default:
        return "Consider archiving important tasks before deletion! 🍯";
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: "bg-amber-50 border-2 border-amber-300 rounded-xl overflow-hidden",
      }}
    >
      <DialogContent className="p-6">
        <Box className="flex items-center gap-2 mb-4">
          <Typography variant="h2" className="text-2xl">
            🐝
          </Typography>
          <Typography variant="h5" className="text-amber-800">
            Oh honey! Are you sure?
          </Typography>
        </Box>
        <Box className="space-y-4">
          <Typography className="text-amber-900">{message}</Typography>

          <Box className="bg-amber-100 p-3 rounded-lg border border-amber-200">
            <Typography variant="body2" className="text-amber-700">
              <span className="font-medium">Busy Bees Tip: </span>
              {getTip()}
            </Typography>
          </Box>
        </Box>
        <Box className="flex justify-end gap-3 mt-6">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="bg-amber-50 border-2 border-amber-300 hover:bg-amber-100 text-amber-800"
          >
            Keep Buzzing
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
