import React, { useState } from "react";
import { Grid, TextField, InputAdornment } from "@mui/material";
import { Search, Edit, Trash2, MoreVertical, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Typography } from "../atoms/Typography";
import { Button } from "../atoms/Button";
import { Card } from "../atoms/Card";
import { Box } from "../atoms/Box";
import { IconButton } from "../atoms/IconButton";
import { Menu } from "../atoms/Menu";
import { MenuItem } from "../atoms/MenuItem";
import { Container } from "../molecules/layout/Container";
import { LoadingSpinner } from "../molecules/feedback/LoadingSpinner";
import { ErrorMessage } from "../molecules/feedback/ErrorMessage";
import { EmptyState } from "../molecules/data-display/EmptyState";
import { Header } from "../organisms/Header";
import { CreateBoardModal } from "../molecules/CreateBoardModal";
import { EditBoardModal } from "../molecules/EditBoardModal";
import { DeleteConfirmationModal } from "../molecules/DeleteConfirmationModal";
import EmojiNatureIcon from "@mui/icons-material/EmojiNature";
import type { Board } from "../../types/types";

interface BoardListTemplateProps {
  boards: Board[];
  loading: boolean;
  error: string | null;
  deleteLoading: boolean;
  onBoardCreated: () => Promise<void>;
  onBoardUpdated: () => Promise<void>;
  onDeleteBoard: (boardId: string) => Promise<void>;
  getDeleteMessage: (board: Board | null) => string;
}

export const BoardListTemplate: React.FC<BoardListTemplateProps> = ({
  boards,
  loading,
  error,
  deleteLoading,
  onBoardCreated,
  onBoardUpdated,
  onDeleteBoard,
  getDeleteMessage,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState(false);
  const [editBoardData, setEditBoardData] = useState<{ id: string; name: string } | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});
  const [deletingBoard, setDeletingBoard] = useState<Board | null>(null);

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
    await onDeleteBoard(deletingBoard.id);
    setDeletingBoard(null);
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return <ErrorMessage message={error} fullScreen showBackButton />;
  }

  const filteredBoards = boards.filter(board =>
    board.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box className="min-h-screen bg-amber-50">
      <Header />
      <Container maxWidth="xl" className="pt-20">
        <Box className="flex justify-between items-center mb-8">
          <Typography variant="h4" className="font-bold text-amber-800">
            My Boards
          </Typography>
          <Box className="flex items-center gap-4">
            <TextField
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search boards..."
              className="w-64"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search className="w-4 h-4 text-amber-500" />
                  </InputAdornment>
                ),
                sx: {
                  "& input": {
                    padding: "8px 14px",
                  },
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {},
              }}
            />
            <Button
              onClick={() => setIsCreateBoardModalOpen(true)}
              icon={<Plus className="w-4 h-4" />}
            >
              Create Board
            </Button>
          </Box>
        </Box>

        {filteredBoards.length === 0 && searchQuery && (
          <EmptyState
            title="No boards found"
            message={`No boards found matching "${searchQuery}"`}
            icon={<Search className="w-8 h-8 text-amber-400" />}
          />
        )}

        {boards.length === 0 && !searchQuery && (
          <Box className="flex flex-col items-center justify-center min-h-[60vh] relative">
            <Box className="relative">
              <EmojiNatureIcon
                sx={{
                  fontSize: 120,
                  color: "#f59e0b",
                  animation: "bounce 2s infinite",
                }}
                className="animate-bounce"
              />
              <Box className="absolute -top-4 -right-4 w-8 h-8 bg-amber-200 rounded-full animate-ping">
                {" "}
              </Box>
              <Box className="absolute -bottom-2 -left-2 w-6 h-6 bg-amber-300 rounded-full animate-ping delay-500">
                {" "}
              </Box>
            </Box>

            <Typography variant="h4" className="mt-8 font-bold text-amber-800 text-center">
              Welcome to Your Hive! 🐝
            </Typography>
            <Typography variant="body1" className="mt-4 text-amber-600 text-center max-w-md">
              Start organizing your tasks by creating your first board. Let's make your workflow as
              sweet as honey!
            </Typography>

            <Button
              onClick={() => setIsCreateBoardModalOpen(true)}
              icon={<Plus className="w-5 h-5" />}
              className="mt-8 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform transition-all hover:scale-105"
            >
              Create Your First Board
            </Button>
          </Box>
        )}

        <Grid container spacing={3}>
          {filteredBoards.map(board => (
            <Grid item xs={12} sm={6} md={4} key={board.id}>
              <Card
                className="group hover:shadow-lg transition-all duration-200 cursor-pointer border border-amber-100"
                onClick={() => navigate(`/board/${board.id}`)}
              >
                <Box className="p-6 space-y-3">
                  <Box className="flex justify-between items-start">
                    <Box>
                      <Typography
                        variant="h6"
                        className="text-amber-800 group-hover:text-amber-600"
                      >
                        {board.name}
                      </Typography>
                      <Typography variant="body2" className="text-amber-600">
                        Created {new Date(board.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <IconButton
                      onClick={e => handleMenuOpen(e, board.id)}
                      className="text-amber-400 hover:text-amber-600"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </IconButton>
                  </Box>

                  <Box className="flex space-x-2">
                    <Box className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      {board.total_tasks} tasks
                    </Box>
                    {board.completed_tasks > 0 && (
                      <Box className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {board.completed_tasks} completed
                      </Box>
                    )}
                  </Box>
                </Box>

                <Menu
                  anchorEl={menuAnchorEl[board.id]}
                  open={Boolean(menuAnchorEl[board.id])}
                  onClose={() => handleMenuClose(board.id)}
                  onClick={e => e.stopPropagation()}
                >
                  <MenuItem
                    onClick={() => handleEditBoard(board)}
                    sx={{
                      color: "primary.dark",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Edit size={16} />
                    Edit
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleDeleteClick(board)}
                    sx={{
                      color: "error.main",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Trash2 size={16} />
                    Delete
                  </MenuItem>
                </Menu>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <CreateBoardModal
        open={isCreateBoardModalOpen}
        onClose={() => setIsCreateBoardModalOpen(false)}
        onBoardCreated={onBoardCreated}
      />
      {editBoardData && (
        <EditBoardModal
          open={!!editBoardData}
          onClose={() => setEditBoardData(null)}
          boardId={editBoardData.id}
          currentName={editBoardData.name}
          onBoardUpdated={onBoardUpdated}
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
    </Box>
  );
};
