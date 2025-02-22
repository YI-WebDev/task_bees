import React from "react";
import { MenuItem as MuiMenuItem, MenuItemProps } from "@mui/material";

interface CustomMenuItemProps extends MenuItemProps {
  children: React.ReactNode;
}

export const MenuItem: React.FC<CustomMenuItemProps> = ({ children, ...props }) => {
  return <MuiMenuItem {...props}>{children}</MuiMenuItem>;
};
