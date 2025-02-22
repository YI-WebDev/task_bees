import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/contexts/AuthContext";
import { RouteProvider } from "./components/providers/RouteProvider";
import { ThemeProvider } from "./components/providers/ThemeProvider";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <RouteProvider />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
