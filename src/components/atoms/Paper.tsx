import React from "react";
import { Paper as MuiPaper, PaperProps } from "@mui/material";

interface CustomPaperProps extends PaperProps {
  children: React.ReactNode;
}

export const Paper: React.FC<CustomPaperProps> = ({ children, ...props }) => {
  return <MuiPaper {...props}>{children}</MuiPaper>;
};
