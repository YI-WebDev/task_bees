import React, { useState, useEffect } from "react";
import { Box } from "../atoms/Box";
import { Container } from "@mui/material";
import { Header } from "../organisms/Header";
import { List } from "../organisms/List";
import { List as ListType, Board } from "../../types/types";
import { Button } from "../atoms/Button";
import { Plus } from "lucide-react";
import { CreateListModal } from "../molecules/CreateListModal";
import { EditListModal } from "../molecules/EditListModal";
import { deleteList, getBoards } from "../services/boardService";
import { EmptyState } from "../molecules/data-display/EmptyState";
import { Sidebar } from "../molecules/navigation/Sidebar";
import { CreateBoardModal } from "../molecules/CreateBoardModal";

interface DashboardTemplateProps {
  boardId: string;
  lists: ListType[];
  onDragStart: (
    e: React.DragEvent,
    taskId: string,
    sourceListId: string,
    currentIndex: number
  ) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, listId: string, dropIndex: number) => void;
  onCreateTask: (data: { title: string; description: string; listId: string }) => Promise<void>;
  onTaskDeleted: () => void;
  onListCreated: () => void;
  onListUpdated: () => void;
  onListDeleted: () => void;
}

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  boardId,
  lists,
  onDragStart,
  onDragOver,
  onDrop,
  onCreateTask,
  onTaskDeleted,
  onListCreated,
  onListUpdated,
  onListDeleted,
}) => {
  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false);
  const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState(false);
  const [editingList, setEditingList] = useState<ListType | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [loadingBoards, setLoadingBoards] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

  useEffect(() => {
    loadBoards();
  }, []);

    useEffect(() => {
    loadBoards();
  }, [lists]);

  const handleDeleteList = async (listId: string) => {
    try {
      await deleteList(listId);
      onListDeleted();
    } catch (error) {
      console.error("Failed to delete list:", error);
    }
  };

  const handleCreateTask = async (data: { title: string; description: string; listId: string }) => {
    await onCreateTask(data);
    loadBoards();   };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "primary.50", display: "flex" }}>
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
          position: "relative",
          paddingTop: "72px",
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
              onClick={() => setIsCreateListModalOpen(true)}
              icon={<Plus className="w-4 h-4" />}
              className="bg-white text-amber-600 hover:bg-amber-50"
            >
              Add List
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
            {lists.map(list => (
              <List
                key={list.id}
                list={list}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onTaskDeleted={onTaskDeleted}
                onEditList={() => setEditingList(list)}
                onDeleteList={() => handleDeleteList(list.id)}
                onCreateTask={handleCreateTask}
              />
            ))}

            {lists.length === 0 && (
              <EmptyState
                title="No lists yet"
                message="Create your first list to start organizing tasks"
                actionLabel="Create Your First List"
                onAction={() => setIsCreateListModalOpen(true)}
                icon={<Plus className="w-8 h-8 text-amber-400" />}
              />
            )}
          </Box>
        </Container>
      </Box>

      <CreateListModal
        open={isCreateListModalOpen}
        onClose={() => setIsCreateListModalOpen(false)}
        onListCreated={() => {
          onListCreated();
          loadBoards();
        }}
        boardId={boardId}
      />

      {editingList && (
        <EditListModal
          open={!!editingList}
          onClose={() => setEditingList(null)}
          onListUpdated={() => {
            onListUpdated();
            loadBoards();
          }}
          list={editingList}
        />
      )}

      <CreateBoardModal
        open={isCreateBoardModalOpen}
        onClose={() => setIsCreateBoardModalOpen(false)}
        onBoardCreated={loadBoards}
      />
    </Box>
  );
};