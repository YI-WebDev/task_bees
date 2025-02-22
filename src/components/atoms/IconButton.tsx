import React from "react";
import { IconButton as MuiIconButton, IconButtonProps } from "@mui/material";

interface CustomIconButtonProps extends IconButtonProps {
  children: React.ReactNode;
}

export const IconButton: React.FC<CustomIconButtonProps> = ({ children, ...props }) => {
  return <MuiIconButton {...props}>{children}</MuiIconButton>;
};
