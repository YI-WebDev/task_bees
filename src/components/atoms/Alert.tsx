import React from "react";
import { Alert as MuiAlert, AlertProps } from "@mui/material";

interface CustomAlertProps extends AlertProps {
  children: React.ReactNode;
}

export const Alert: React.FC<CustomAlertProps> = ({ children, ...props }) => {
  return <MuiAlert {...props}>{children}</MuiAlert>;
};
