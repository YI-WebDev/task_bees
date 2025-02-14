import React, { useState } from "react";
import { Box, Container, TextField, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Typography } from "../atoms/Typography";
import { Button } from "../atoms/Button";
import { createBoard } from "../services/boardService";

export const CreateBoard: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createBoard({ name });
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create board");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "warning.50", pt: 8 }}>
      <Container maxWidth="sm">
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            backgroundColor: "white",
            p: 4,
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Typography variant="h4" className="mb-4 text-center">
            Create New Board
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Board Name"
            value={name}
            onChange={e => setName(e.target.value)}
            sx={{ mb: 3 }}
            required
          />

          <Button fullWidth type="submit" disabled={loading} className="mb-2">
            {loading ? "Creating..." : "Create Board"}
          </Button>

          <Box sx={{ textAlign: "center" }}>
            <Button variant="secondary" onClick={() => navigate("/dashboard")}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
