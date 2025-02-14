import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box } from "@mui/material";
import { Button } from "../atoms/Button";
import { updateBoard } from "../services/boardService";

interface EditBoardModalProps {
  open: boolean;
  onClose: () => void;
  onBoardUpdated: () => void;
  boardId: string;
  currentName: string;
}

export const EditBoardModal: React.FC<EditBoardModalProps> = ({
  open,
  onClose,
  onBoardUpdated,
  boardId,
  currentName,
}) => {
  const [name, setName] = useState(currentName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateBoard(boardId, { name });
      onBoardUpdated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update board");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Edit Board</DialogTitle>
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
            {loading ? "Updating..." : "Update Board"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
