import React, { useState } from "react";
import { Box, Container, TextField, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Typography } from "../atoms/Typography";
import { Button } from "../atoms/Button";
import { signUp } from "../services/authService";
import EmojiNatureIcon from "@mui/icons-material/EmojiNature";

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signUp(email, password, username);
      navigate("/login", { state: { message: "Registration successful! Please log in." } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="min-h-screen bg-amber-50 relative flex items-center justify-center">
      <Box className="absolute top-10 left-10 animate-bounce">
        <EmojiNatureIcon sx={{ fontSize: 32, color: "#fbbf24" }} />
      </Box>
      <Box className="absolute bottom-10 right-10 animate-bounce delay-100">
        <EmojiNatureIcon sx={{ fontSize: 32, color: "#fbbf24" }} />
      </Box>

      <Container maxWidth="sm">
        <Box
          component="form"
          onSubmit={handleRegister}
          className="bg-white p-8 rounded-xl shadow-lg transform transition-all hover:scale-[1.01]"
        >
          <Box className="text-center space-y-2 mb-6">
            <Typography variant="h4" className="font-bold text-amber-800">
              Join the Hive! 🐝
            </Typography>
            <Typography variant="body1" className="text-amber-600">
              Start organizing your tasks with TaskBees
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}

          <Box className="space-y-4">
            <Box className="space-y-2">
              <Typography variant="body2" className="font-medium text-amber-700">
                Username<span className="text-amber-500">*</span>
              </Typography>
              <TextField
                fullWidth
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="buzzy_bee"
                required
                className="border-amber-200 focus:border-amber-400"
              />
            </Box>

            <Box className="space-y-2">
              <Typography variant="body2" className="font-medium text-amber-700">
                Email<span className="text-amber-500">*</span>
              </Typography>
              <TextField
                fullWidth
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="buzz@taskbees.com"
                required
                className="border-amber-200 focus:border-amber-400"
              />
            </Box>

            <Box className="space-y-2">
              <Typography variant="body2" className="font-medium text-amber-700">
                Password<span className="text-amber-500">*</span>
              </Typography>
              <TextField
                fullWidth
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="border-amber-200 focus:border-amber-400"
              />
            </Box>

            <Button
              fullWidth
              type="submit"
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              {loading ? "Creating account..." : "Join the Hive"}
            </Button>

            <Box className="text-center">
              <Button
                variant="secondary"
                onClick={() => navigate("/login")}
                className="text-amber-600 hover:text-amber-700"
              >
                Already have an account? Buzz in! 🍯
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
