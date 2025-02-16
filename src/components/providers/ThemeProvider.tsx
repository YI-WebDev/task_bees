import React from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import { theme } from "./theme";

export const colors = {
  primary: {
    50: "#fff8e1",
    100: "#ffecb3",
    200: "#ffe082",
    300: "#ffd54f",
    400: "#ffca28",
    500: "#ffa726",
    600: "#ffb300",
    700: "#f57c00",
    800: "#ff8f00",
    900: "#ff6f00",
  },
} as const;

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};
