import React, { useState } from "react";
import { AppBar, Toolbar, Box, Avatar } from "@mui/material";
import { LogOut, User, Settings } from "lucide-react";
import EmojiNatureIcon from "@mui/icons-material/EmojiNature";
import { Typography } from "../atoms/Typography";
import { IconButton } from "../atoms/IconButton";
import { Menu } from "../atoms/Menu";
import { MenuItem } from "../atoms/MenuItem";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const Header: React.FC = () => {
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

  const handleSettingsClick = () => {
    handleMenuClose();
    navigate("/settings");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "primary.main",
        width: "100%",
        zIndex: 1300,
      }}
    >
      <Toolbar
        sx={{
          minHeight: 72,
          px: { xs: 2, sm: 4, md: 6 },
        }}
      >
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
          <EmojiNatureIcon sx={{ fontSize: 48, marginRight: 1.5, color: "white" }} />
          <Typography variant="h4" component="h1" className="font-bold text-white">
            TaskBees
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton
          onClick={handleMenuOpen}
          className="w-12 h-12 bg-primary-400/20 hover:bg-primary-400/30"
        >
          {user?.email ? (
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: "primary.dark",
                fontSize: "1.25rem",
              }}
            >
              {user.user_metadata?.username
                ? user.user_metadata.username[0].toUpperCase()
                : user.email[0].toUpperCase()}
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
          PaperProps={{
            className:
              "bg-white/95 backdrop-blur-sm border border-primary-100 shadow-lg rounded-xl overflow-hidden",
          }}
        >
          <Box className="px-4 py-3 border-b border-primary-100 bg-primary-50/50">
            <Typography variant="body2" className="text-primary-800 font-medium">
              {user?.email}
            </Typography>
            {user?.user_metadata?.username && (
              <Typography variant="caption" className="text-primary-600">
                @{user.user_metadata.username}
              </Typography>
            )}
          </Box>
          <MenuItem
            onClick={handleSettingsClick}
            className="px-4 py-3 text-primary-700 hover:bg-primary-50 flex items-center gap-2 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Settings
          </MenuItem>
          <MenuItem
            onClick={handleSignOut}
            className="px-4 py-3 text-primary-700 hover:bg-primary-50 flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
