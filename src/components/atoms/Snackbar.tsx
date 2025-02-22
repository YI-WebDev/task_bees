import React from "react";
import MuiSnackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import { SnackbarCloseReason } from "@mui/material/Snackbar/Snackbar";

export type Severity = AlertColor;

type SnackbarProps = {
  open: boolean;
  message: string;
  severity: Severity;
  onClose: () => void;
};

export const Snackbar = ({ open, message, severity, onClose }: SnackbarProps) => {
  const handleClose = (_event: React.SyntheticEvent | Event, reason: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return;
    }
    onClose();
  };
  return (
    <MuiSnackbar open={open} autoHideDuration={5000} onClose={handleClose}>
      <MuiAlert
        severity={severity}
        className="whitespace-pre-line"
        variant="filled"
        onClose={onClose}
      >
        {message}
      </MuiAlert>
    </MuiSnackbar>
  );
};
