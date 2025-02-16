import React, { useState } from "react";
import { Container, Box, Alert } from "@mui/material";
import { Header } from "../organisms/Header";
import { Typography } from "../atoms/Typography";
import { TextField } from "../atoms/TextField";
import { Button } from "../atoms/Button";
import { useAuth } from "../contexts/AuthContext";
import { updateUserProfile, updateUserPassword } from "../services/authService";
import { User, Mail, KeyRound, ShieldCheck } from "lucide-react";

export const Settings: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [email, setEmail] = useState(user?.email || "");
  const [username, setUsername] = useState(user?.user_metadata?.username || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateUserProfile(user.id, username, email !== user.email ? email : undefined);

      await refreshUser();
      setSuccess("Profile updated successfully! 🎉");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateUserPassword(newPassword);
      setSuccess("Password updated successfully! 🔒");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100/50">
      <Header />
      <Container maxWidth="md" className="pt-20">
        <Box className="flex items-center gap-3 mb-8">
          <Box className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-amber-600" />
          </Box>
          <Typography variant="h4" className="text-amber-800 font-bold">
            Account Settings
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" className="mb-6 border border-red-200 bg-red-50 rounded-xl">
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" className="mb-6 border border-green-200 bg-green-50 rounded-xl">
            {success}
          </Alert>
        )}

        <Box className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-amber-100 p-6 mb-6">
          <Typography
            variant="h6"
            className="text-amber-700 font-medium mb-6 flex items-center gap-2"
          >
            <User className="w-5 h-5" />
            Profile Information
          </Typography>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <Box className="space-y-4">
              <Box className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-amber-500" />
                <TextField
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  fullWidth
                  className="bg-white"
                />
              </Box>

              <Box className="flex items-center gap-2">
                <User className="w-5 h-5 text-amber-500" />
                <TextField
                  label="Username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  fullWidth
                  className="bg-white"
                />
              </Box>
            </Box>

            <Box className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white shadow-sm"
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          </form>
        </Box>

        <Box className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-amber-100 p-6">
          <Typography
            variant="h6"
            className="text-amber-700 font-medium mb-6 flex items-center gap-2"
          >
            <KeyRound className="w-5 h-5" />
            Change Password
          </Typography>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <Box className="space-y-4">
              <Box className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-500" />
                <TextField
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  fullWidth
                  className="bg-white"
                />
              </Box>

              <Box className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-500" />
                <TextField
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  fullWidth
                  className="bg-white"
                />
              </Box>
            </Box>

            <Box className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white shadow-sm"
              >
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </Box>
          </form>
        </Box>
      </Container>
    </Box>
  );
};
