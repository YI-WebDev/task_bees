import React from "react";
import { Box, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Typography } from "../../atoms/Typography";
import { Button } from "../../atoms/Button";
import { Plus, LayoutDashboard, ChevronLeft } from "lucide-react";
import { IconButton } from "../../atoms/IconButton";
import type { Board } from "../../../types/types";

interface SidebarContentProps {
  boards: Board[];
  currentBoardId?: string;
  onCreateBoard: () => void;
  loading?: boolean;
  onClose?: () => void;
}

export const SidebarContent: React.FC<SidebarContentProps> = ({
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
        <Button onClick={onCreateBoard} fullWidth icon={<Plus className="w-4 h-4" />}>
          Create Board
        </Button>
        <IconButton
          onClick={onClose}
          className="ml-2 text-amber-700 hover:text-amber-800 hover:bg-amber-100"
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
                      backgroundColor: "primary.light",
                      "&:hover": {
                        backgroundColor: "primary.light",
                      },
                    },
                    "&:hover": {
                      backgroundColor: "primary.50",
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
