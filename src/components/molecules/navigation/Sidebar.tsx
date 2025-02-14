import React from "react";
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Typography } from "../../atoms/Typography";
import { Button } from "../../atoms/Button";
import { Plus, LayoutDashboard, ChevronLeft, ChevronRight } from "lucide-react";
import { IconButton } from "../../atoms/IconButton";
import type { Board } from "../../../types/types";

interface SidebarProps {
  boards: Board[];
  currentBoardId?: string;
  onCreateBoard: () => void;
  loading?: boolean;
  open?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  boards,
  currentBoardId,
  onCreateBoard,
  loading = false,
  open = true,
  onClose,
}) => {
  const navigate = useNavigate();
  const drawerWidth = 280;
  const collapsedWidth = 24;

  const drawerStyles = {
    width: drawerWidth,
    boxSizing: "border-box" as const,
    backgroundColor: "white",
    borderRight: "1px solid",
    borderColor: "warning.light",
    overflowX: "hidden" as const,
  };

  return (
    <>
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": {
            ...drawerStyles,
          },
        }}
      >
        <SidebarContent
          boards={boards}
          currentBoardId={currentBoardId}
          onCreateBoard={onCreateBoard}
          loading={loading}
          onClose={onClose}
        />
      </Drawer>
      <Box
        sx={{
          display: { xs: "none", lg: "block" },
          position: "fixed",
          height: "100%",
          zIndex: 1200,
        }}
      >
        <Drawer
          variant="permanent"
          sx={{
            width: open ? drawerWidth : collapsedWidth,
            transition: "width 0.2s",
            height: "100%",
            "& .MuiDrawer-paper": {
              ...drawerStyles,
              position: "static",
              transition: "transform 0.2s, width 0.2s",
              width: open ? drawerWidth : collapsedWidth,
              overflow: "hidden",
            },
          }}
        >
          {open ? (
            <SidebarContent
              boards={boards}
              currentBoardId={currentBoardId}
              onCreateBoard={onCreateBoard}
              loading={loading}
              onClose={onClose}
            />
          ) : (
            <Box
              sx={{
                width: collapsedWidth,
                height: "100%",
                backgroundColor: "white",
                borderRight: "1px solid",
                borderColor: "warning.light",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "warning.50",
                },
              }}
              onClick={onClose}
            >
              <IconButton
                className="w-6 h-6 mt-2 text-amber-600"
              >
                <ChevronRight className="w-4 h-4" />
              </IconButton>
            </Box>
          )}
        </Drawer>
      </Box>
    </>
  );
};

interface SidebarContentProps {
  boards: Board[];
  currentBoardId?: string;
  onCreateBoard: () => void;
  loading?: boolean;
  onClose?: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  boards,
  currentBoardId,
  onCreateBoard,
  loading = false,
  onClose,
}) => {
  const navigate = useNavigate();

  return (
    <Box className="p-4">
      <Box className="flex items-center justify-between mb-4">
        <Button
          onClick={onCreateBoard}
          fullWidth
          icon={<Plus className="w-4 h-4" />}
        >
          Create Board
        </Button>
        <IconButton
          onClick={onClose}
          className="ml-2 text-amber-600 hover:bg-amber-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </IconButton>
      </Box>

      <Typography variant="body2" className="text-amber-800 font-medium mb-2 px-2">
        Your Boards
      </Typography>

      <List className="space-y-1">
        {loading
          ? Array.from({ length: 3 }).map((_, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  className="rounded-lg"
                  sx={{
                    opacity: 0.5,
                    animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                    "@keyframes pulse": {
                      "0%, 100%": {
                        opacity: 0.5,
                      },
                      "50%": {
                        opacity: 0.3,
                      },
                    },
                  }}
                >
                  <Box className="w-full h-6 bg-amber-100 rounded" />
                </ListItemButton>
              </ListItem>
            ))
          : boards.map(board => (
              <ListItem key={board.id} disablePadding>
                <ListItemButton
                  onClick={() => navigate(`/board/${board.id}`)}
                  selected={board.id === currentBoardId}
                  className="rounded-lg"
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "warning.light",
                      "&:hover": {
                        backgroundColor: "warning.light",
                      },
                    },
                    "&:hover": {
                      backgroundColor: "warning.50",
                    },
                  }}
                >
                  <Box className="flex items-center gap-2 w-full">
                    <LayoutDashboard
                      className={`w-4 h-4 ${
                        board.id === currentBoardId ? "text-amber-600" : "text-amber-400"
                      }`}
                    />
                    <ListItemText
                      primary={board.name}
                      primaryTypographyProps={{
                        className: `truncate ${
                          board.id === currentBoardId ? "text-amber-800" : "text-amber-600"
                        }`,
                      }}
                      secondary={`${board.total_tasks} tasks`}
                      secondaryTypographyProps={{
                        className: "text-xs text-amber-400",
                      }}
                    />
                  </Box>
                </ListItemButton>
              </ListItem>
            ))}
      </List>
    </Box>
  );
};