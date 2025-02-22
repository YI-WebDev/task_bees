import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Dashboard } from "../pages/Dashboard";
import { BoardList } from "../pages/BoardList";
import { Settings } from "../pages/Settings";
import { RequireAuth } from "../contexts/AuthContext";

export const RouteProvider: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/settings"
        element={
          <RequireAuth>
            <Settings />
          </RequireAuth>
        }
      />
      <Route
        path="/boards"
        element={
          <RequireAuth>
            <BoardList />
          </RequireAuth>
        }
      />
      <Route
        path="/board/:boardId"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route path="/" element={<Navigate to="/boards" replace />} />
    </Routes>
  );
};
