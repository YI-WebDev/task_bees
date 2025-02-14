import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { CreateBoard } from "../pages/CreateBoard";
import { Dashboard } from "../pages/Dashboard";
import { BoardList } from "../pages/BoardList";
import { RequireAuth } from "../contexts/AuthContext";

export const RouteProvider: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/boards"
        element={
          <RequireAuth>
            <BoardList />
          </RequireAuth>
        }
      />
      <Route
        path="/create-board"
        element={
          <RequireAuth>
            <CreateBoard />
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