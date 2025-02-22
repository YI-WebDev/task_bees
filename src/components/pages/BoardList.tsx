import React, { useState, useEffect } from "react";
import { getBoards, deleteBoard } from "../services/boardService";
import { BoardListTemplate } from "../templates/BoardListTemplate";
import type { Board } from "../../types/types";

export const BoardList: React.FC = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadBoards = async () => {
    try {
      const boardsData = await getBoards();
      setBoards(boardsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load boards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBoards();
  }, []);

  const handleDeleteBoard = async (boardId: string) => {
    setDeleteLoading(true);
    try {
      await deleteBoard(boardId);
      await loadBoards();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete board");
    } finally {
      setDeleteLoading(false);
    }
  };

  const getDeleteMessage = (board: Board | null) => {
    if (!board) return "";

    const taskCount = board.total_tasks;
    const taskText = taskCount === 1 ? "task" : "tasks";

    return `You're about to delete the "${board.name}" board${
      taskCount > 0 ? ` with ${taskCount} ${taskText}` : ""
    }. All lists and tasks in this board will be permanently removed and this action cannot be undone.`;
  };

  return (
    <BoardListTemplate
      boards={boards}
      loading={loading}
      error={error}
      deleteLoading={deleteLoading}
      onBoardCreated={loadBoards}
      onBoardUpdated={loadBoards}
      onDeleteBoard={handleDeleteBoard}
      getDeleteMessage={getDeleteMessage}
    />
  );
};
