import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getBoards, deleteBoard } from "../services/boardService";
import { CreateBoardModal } from "../molecules/CreateBoardModal";
import { EditBoardModal } from "../molecules/EditBoardModal";
import { DeleteConfirmationModal } from "../molecules/DeleteConfirmationModal";
import { BoardListTemplate } from "../templates/BoardListTemplate";
import type { Board } from "../../types/types";

export const BoardList: React.FC = () => {
  const { signOut } = useAuth();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState(false);
  const [editBoardData, setEditBoardData] = useState<{ id: string; name: string } | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});
  const [deletingBoard, setDeletingBoard] = useState<Board | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, boardId: string) => {
    event.stopPropagation();
    setMenuAnchorEl({ ...menuAnchorEl, [boardId]: event.currentTarget });
  };

  const handleMenuClose = (boardId: string) => {
    setMenuAnchorEl({ ...menuAnchorEl, [boardId]: null });
  };

  const handleEditBoard = (board: Board) => {
    setEditBoardData({ id: board.id, name: board.name });
    handleMenuClose(board.id);
  };

  const handleDeleteClick = (board: Board) => {
    setDeletingBoard(board);
    handleMenuClose(board.id);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingBoard) return;

    setDeleteLoading(true);
    try {
      await deleteBoard(deletingBoard.id);
      await loadBoards();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete board");
    } finally {
      setDeleteLoading(false);
      setDeletingBoard(null);
    }
  };

  const getDeleteMessage = (board: Board | null) => {
    if (!board) return "";
    
    const taskCount = board.total_tasks;
    const taskText = taskCount === 1 ? "task" : "tasks";
    
    return `You're about to delete the "${board.name}" board${
      taskCount > 0 ? ` with ${taskCount} ${taskText}` : ""
    }. All columns and tasks in this board will be permanently removed and this action cannot be undone.`;
  };

  return (
    <>
      <BoardListTemplate
        boards={boards}
        loading={loading}
        error={error}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateBoard={() => setIsCreateBoardModalOpen(true)}
        onEditBoard={handleEditBoard}
        onDeleteBoard={handleDeleteClick}
        menuAnchorEl={menuAnchorEl}
        onMenuOpen={handleMenuOpen}
        onMenuClose={handleMenuClose}
      />

      <CreateBoardModal
        open={isCreateBoardModalOpen}
        onClose={() => setIsCreateBoardModalOpen(false)}
        onBoardCreated={loadBoards}
      />

      {editBoardData && (
        <EditBoardModal
          open={!!editBoardData}
          onClose={() => setEditBoardData(null)}
          onBoardUpdated={loadBoards}
          boardId={editBoardData.id}
          currentName={editBoardData.name}
        />
      )}

      <DeleteConfirmationModal
        open={!!deletingBoard}
        onClose={() => setDeletingBoard(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Board"
        message={getDeleteMessage(deletingBoard)}
        loading={deleteLoading}
        type="board"
      />
    </>
  );
};