import React, { useState } from "react";
import { AppBar, Toolbar, Box, Avatar } from "@mui/material";
import { LogOut, User } from "lucide-react";
import EmojiNatureIcon from "@mui/icons-material/EmojiNature";
import { Typography } from "../atoms/Typography";
import { IconButton } from "../atoms/IconButton";
import { Menu } from "../atoms/Menu";
import { MenuItem } from "../atoms/MenuItem";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export interface HeaderProps {
  onCreateTask?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onCreateTask }) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogoClick = () => {
    navigate("/boards");
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    handleMenuClose();
    signOut();
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "warning.main" }}>
      <Toolbar sx={{ minHeight: 72 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            "&:hover": {
              opacity: 0.8,
            },
            transition: "opacity 0.2s",
          }}
          onClick={handleLogoClick}
        >
          <EmojiNatureIcon sx={{ fontSize: 48, marginRight: 1.5 }} />
          <Typography variant="h4" component="h1" className="font-bold">
            TaskBees
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton
          onClick={handleMenuOpen}
          className="w-12 h-12 bg-amber-400/20 hover:bg-amber-400/30"
        >
          {user?.email ? (
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: "warning.dark",
                fontSize: "1.25rem",
              }}
            >
              {user.email[0].toUpperCase()}
            </Avatar>
          ) : (
            <User className="w-6 h-6 text-white" />
          )}
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Box className="px-4 py-2 border-b border-amber-100">
            <Typography variant="body2" className="text-amber-800 font-medium">
              {user?.email}
            </Typography>
          </Box>
          <MenuItem
            onClick={handleSignOut}
            sx={{
              color: "warning.dark",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <LogOut size={16} />
            Sign Out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};