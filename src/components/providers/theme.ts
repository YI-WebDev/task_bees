import { createTheme } from "@mui/material";

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

export const theme = createTheme({
  palette: {
    primary: {
      ...colors.primary,
      light: colors.primary[100],
      main: colors.primary[500],
      dark: colors.primary[700],
    },
  },
});
