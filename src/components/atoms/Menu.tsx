import React from "react";
import { Menu as MuiMenu, MenuProps } from "@mui/material";

interface CustomMenuProps extends MenuProps {
  children: React.ReactNode;
}

export const Menu: React.FC<CustomMenuProps> = ({ children, ...props }) => {
  return <MuiMenu {...props}>{children}</MuiMenu>;
};
