import React from "react";
import { Box, Drawer } from "@mui/material";
import { ChevronRight } from "lucide-react";
import { IconButton } from "../../atoms/IconButton";
import type { Board } from "../../../types/types";
import { SidebarContent } from "./SidebarContent";

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
  const drawerWidth = 280;
  const collapsedWidth = 24;

  const drawerStyles = {
    width: drawerWidth,
    boxSizing: "border-box" as const,
    borderRight: "1px solid",
    borderColor: "primary.light",
    overflowX: "hidden" as const,
    marginTop: "72px",
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
            marginTop: 0,
            height: "100%",
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
          height: "calc(100% - 72px)",
          top: "72px",
          zIndex: 1200,
          backgroundColor: "primary.50",
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
              marginTop: 0,
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
                borderColor: "primary.light",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "primary.50",
                },
              }}
              onClick={onClose}
            >
              <IconButton className="w-6 h-6 mt-2 text-amber-600">
                <ChevronRight className="w-4 h-4" />
              </IconButton>
            </Box>
          )}
        </Drawer>
      </Box>
    </>
  );
};
