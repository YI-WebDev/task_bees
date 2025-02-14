import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box } from "@mui/material";
import { Button } from "../atoms/Button";
import { createBoard } from "../services/boardService";

interface CreateBoardModalProps {
  open: boolean;
  onClose: () => void;
  onBoardCreated: () => void;
}

export const CreateBoardModal: React.FC<CreateBoardModalProps> = ({
  open,
  onClose,
  onBoardCreated,
}) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createBoard({ name });
      setName("");
      onBoardCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create board");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Create New Board</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              label="Board Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              fullWidth
              error={!!error}
              helperText={error}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Board"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
