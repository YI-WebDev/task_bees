import React, { useState, useEffect } from "react";
import { Box } from "../atoms/Box";
import { Container } from "@mui/material";
import { Header } from "../organisms/Header";
import { Column } from "../organisms/Column";
import { Column as ColumnType, Board } from "../../types/types";
import { Button } from "../atoms/Button";
import { Plus } from "lucide-react";
import { CreateColumnModal } from "../molecules/CreateColumnModal";
import { EditColumnModal } from "../molecules/EditColumnModal";
import { deleteColumn, getBoards } from "../services/boardService";
import { EmptyState } from "../molecules/data-display/EmptyState";
import { Sidebar } from "../molecules/navigation/Sidebar";
import { CreateBoardModal } from "../molecules/CreateBoardModal";

interface DashboardTemplateProps {
  boardId: string;
  columns: ColumnType[];
  onDragStart: (
    e: React.DragEvent,
    taskId: string,
    sourceColumnId: string,
    currentIndex: number
  ) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, columnId: string, dropIndex: number) => void;
  onCreateTask: (data: { title: string; description: string; columnId: string }) => Promise<void>;
  onTaskDeleted: () => void;
  onColumnCreated: () => void;
  onColumnUpdated: () => void;
  onColumnDeleted: () => void;
}

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  boardId,
  columns,
  onDragStart,
  onDragOver,
  onDrop,
  onCreateTask,
  onTaskDeleted,
  onColumnCreated,
  onColumnUpdated,
  onColumnDeleted,
}) => {
  const [isCreateColumnModalOpen, setIsCreateColumnModalOpen] = useState(false);
  const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState<ColumnType | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [loadingBoards, setLoadingBoards] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const loadBoards = async () => {
      try {
        const boardsData = await getBoards();
        setBoards(boardsData);
      } catch (error) {
        console.error("Failed to load boards:", error);
      } finally {
        setLoadingBoards(false);
      }
    };

    loadBoards();
  }, []);

  const handleDeleteColumn = async (columnId: string) => {
    try {
      await deleteColumn(columnId);
      onColumnDeleted();
    } catch (error) {
      console.error("Failed to delete column:", error);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "warning.50", display: "flex" }}>
      <Sidebar
        boards={boards}
        currentBoardId={boardId}
        onCreateBoard={() => setIsCreateBoardModalOpen(true)}
        loading={loadingBoards}
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <Box 
        sx={{ 
          flexGrow: 1, 
          marginLeft: { lg: isSidebarOpen ? "280px" : "24px" }, 
          transition: "margin 0.2s",
          width: { lg: `calc(100% - ${isSidebarOpen ? "280px" : "24px"})` },
          position: "relative"
        }}
      >
        <Header />
        <Container 
          maxWidth="xl" 
          sx={{ 
            py: 4,
            px: { xs: 2, sm: 3 },
          }}
        >
          <Box className="flex items-center mb-6">
            <Button
              onClick={() => setIsCreateColumnModalOpen(true)}
              icon={<Plus className="w-4 h-4" />}
              className="bg-white text-amber-600 hover:bg-amber-50"
            >
              Add Column
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 3,
              overflowX: "auto",
              pb: 2,
              alignItems: "flex-start",
            }}
          >
            {columns.map(column => (
              <Column
                key={column.id}
                column={column}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onTaskDeleted={onTaskDeleted}
                onEditColumn={() => setEditingColumn(column)}
                onDeleteColumn={() => handleDeleteColumn(column.id)}
                onCreateTask={onCreateTask}
              />
            ))}

            {columns.length === 0 && (
              <EmptyState
                title="No columns yet"
                message="Create your first column to start organizing tasks"
                actionLabel="Create Your First Column"
                onAction={() => setIsCreateColumnModalOpen(true)}
                icon={<Plus className="w-8 h-8 text-amber-400" />}
              />
            )}
          </Box>
        </Container>
      </Box>

      <CreateColumnModal
        open={isCreateColumnModalOpen}
        onClose={() => setIsCreateColumnModalOpen(false)}
        onColumnCreated={onColumnCreated}
        boardId={boardId}
      />

      {editingColumn && (
        <EditColumnModal
          open={!!editingColumn}
          onClose={() => setEditingColumn(null)}
          onColumnUpdated={onColumnUpdated}
          column={editingColumn}
        />
      )}

      <CreateBoardModal
        open={isCreateBoardModalOpen}
        onClose={() => setIsCreateBoardModalOpen(false)}
        onBoardCreated={() => {
          getBoards().then(setBoards).catch(console.error);
        }}
      />
    </Box>
  );
};