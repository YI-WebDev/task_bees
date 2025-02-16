import React from "react";
import { Container as MuiContainer, ContainerProps } from "@mui/material";

interface CustomContainerProps extends ContainerProps {
  children: React.ReactNode;
}

export const Container: React.FC<CustomContainerProps> = ({ children, ...props }) => {
  return <MuiContainer {...props}>{children}</MuiContainer>;
};
