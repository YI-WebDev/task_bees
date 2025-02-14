import React from "react";
import { ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/contexts/AuthContext";
import { RouteProvider } from "./components/providers/RouteProvider";

const theme = createTheme({
  palette: {
    warning: {
      light: "#fff3e0",
      main: "#ffa726",
      dark: "#f57c00",
      "50": "#fff8e1",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <RouteProvider />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
