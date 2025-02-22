import React, { useState } from "react";
import { Box, Container, TextField, Alert, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Typography } from "../atoms/Typography";
import { Button } from "../atoms/Button";
import { signIn, signInWithGoogle } from "../services/authService";
import EmojiNatureIcon from "@mui/icons-material/EmojiNature";
import GoogleIcon from "../../assets/GoogleIcon.svg";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signIn(email, password);
      navigate("/boards");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      const data = await signInWithGoogle();
      console.log(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
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
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-xl shadow-lg transform transition-all hover:scale-[1.01]"
        >
          <Box className="text-center space-y-2 mb-6">
            <Typography variant="h4" className="font-bold text-amber-800">
              Welcome to TaskBees! 🐝
            </Typography>
            <Typography variant="body1" className="text-amber-600">
              Where productivity meets honey-sweet organization
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
                Email
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
                Password
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
              {loading ? "Buzzing in..." : "Buzz In"}
            </Button>

            <Box className="text-center">
              <Button
                variant="secondary"
                onClick={() => navigate("/register")}
                className="text-amber-600 hover:text-amber-700"
              >
                New to the hive? Register now! 🍯
              </Button>
            </Box>

            <Box className="relative">
              <Divider className="my-4">
                <Typography variant="body2" className="text-amber-600 px-2">
                  OR
                </Typography>
              </Divider>
            </Box>

            <Button
              fullWidth
              onClick={handleGoogleLogin}
              variant="secondary"
              className="border-2 border-amber-200 hover:bg-amber-50 relative pl-12"
              icon={<img src={GoogleIcon} alt="Google" className="w-6 h-6 absolute left-3" />}
            >
              Continue with Google
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
