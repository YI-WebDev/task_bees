import React, { useState } from "react";
import { Box } from "../atoms/Box";
import { Container } from "@mui/material";
import { Header } from "../organisms/Header";
import { List } from "../organisms/List";
import { List as ListType, Board } from "../../types/types";
import { Button } from "../atoms/Button";
import { Plus } from "lucide-react";
import { CreateListModal } from "../molecules/CreateListModal";
import { EditListModal } from "../molecules/EditListModal";
import { EmptyState } from "../molecules/data-display/EmptyState";
import { Sidebar } from "../molecules/navigation/Sidebar";
import { CreateBoardModal } from "../molecules/CreateBoardModal";
import { InviteBoardModal } from "../molecules/InviteBoardModal";
import { PersonAddAlt1 as InviteIcon } from "@mui/icons-material";

interface DashboardTemplateProps {
  boardId: string;
  lists: ListType[];
  boards: Board[];
  loadingBoards: boolean;
  isSidebarOpen: boolean;
  onSidebarOpenChange: (isOpen: boolean) => void;
  onDragStart: (
    e: React.DragEvent,
    taskId: string,
    sourceListId: string,
    currentIndex: number
  ) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, listId: string, dropIndex: number) => void;
  onCreateTask: (data: { title: string; description: string; listId: string }) => Promise<void>;
  onDeleteList: (listId: string) => Promise<void>;
  onBoardCreated: () => Promise<void>;
  onListCreated: () => Promise<void>;
  onListUpdated: () => Promise<void>;
  onTaskDeleted: () => Promise<void>;
}

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  boardId,
  lists,
  boards,
  loadingBoards,
  isSidebarOpen,
  onSidebarOpenChange,
  onDragStart,
  onDragOver,
  onDrop,
  onCreateTask,
  onDeleteList,
  onBoardCreated,
  onListCreated,
  onListUpdated,
  onTaskDeleted,
}) => {
  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false);
  const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState(false);
  const [editingList, setEditingList] = useState<ListType | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "primary.50", display: "flex" }}>
      <Sidebar
        boards={boards}
        currentBoardId={boardId}
        onCreateBoard={() => setIsCreateBoardModalOpen(true)}
        loading={loadingBoards}
        open={isSidebarOpen}
        onClose={() => onSidebarOpenChange(!isSidebarOpen)}
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
          <Box className="flex items-center justify-between mb-6">
            <Box className="flex gap-2">
              <Button
                onClick={() => setIsCreateListModalOpen(true)}
                icon={<Plus className="w-4 h-4" />}
                className="bg-white text-amber-600 hover:bg-amber-50"
              >
                Add List
              </Button>
              <Button
                onClick={() => setIsInviteModalOpen(true)}
                icon={<InviteIcon className="w-4 h-4" />}
                className="bg-white text-amber-600 hover:bg-amber-50"
              >
                Invite
              </Button>
            </Box>
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
                onEditList={() => setEditingList(list)}
                onDeleteList={() => onDeleteList(list.id)}
                onCreateTask={data => onCreateTask({ ...data, listId: list.id })}
                onTaskDeleted={onTaskDeleted}
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
        onListCreated={onListCreated}
        boardId={boardId}
      />

      {editingList && (
        <EditListModal
          open={!!editingList}
          onClose={() => setEditingList(null)}
          onListUpdated={onListUpdated}
          list={editingList}
        />
      )}

      <CreateBoardModal
        open={isCreateBoardModalOpen}
        onClose={() => setIsCreateBoardModalOpen(false)}
        onBoardCreated={onBoardCreated}
      />

      <InviteBoardModal
        open={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        boardId={boardId}
      />
    </Box>
  );
};
