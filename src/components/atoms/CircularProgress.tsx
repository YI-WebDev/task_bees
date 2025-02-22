import React from "react";
import { CircularProgress as MuiCircularProgress, CircularProgressProps } from "@mui/material";

export const CircularProgress: React.FC<CircularProgressProps> = props => {
  return <MuiCircularProgress {...props} />;
};
