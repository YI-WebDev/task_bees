import React, { useState } from "react";
import { Dialog, DialogContent, Box, TextField } from "@mui/material";
import { Button } from "../atoms/Button";
import { Typography } from "../atoms/Typography";
import { X, Sparkles } from "lucide-react";

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; columnId: string }) => Promise<void>;
  columnId: string;
  columnTitle: string;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  open,
  onClose,
  onSubmit,
  columnId,
  columnTitle,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await onSubmit({ title: title.trim(), description, columnId });
      setTitle("");
      setDescription("");
      onClose();
    } catch (err) {
      console.error("Failed to create task:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: "bg-white/95 rounded-2xl shadow-xl overflow-hidden relative",
      }}
    >
      <form onSubmit={handleSubmit}>
        <Box className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400" />

        <DialogContent className="p-6 space-y-6">
          <Box className="flex items-center justify-between">
            <Box className="flex items-center gap-3">
              <Box className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-500" />
              </Box>
              <Box>
                <Typography variant="h5" className="text-amber-800 font-semibold">
                  Create New Task
                </Typography>
                <Typography variant="body2" className="text-amber-600">
                  in {columnTitle}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="secondary"
              onClick={onClose}
              className="w-10 h-10 !p-0 rounded-full hover:bg-amber-100 text-amber-600"
              icon={<X className="w-5 h-5" />}
            />
          </Box>
          <Box className="space-y-5">
            <Box className="space-y-2.5">
              <Typography variant="body2" className="font-medium text-amber-700 flex items-center gap-1">
                Title
                <span className="text-amber-500">*</span>
              </Typography>
              <TextField
                fullWidth
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="What needs to bee done? 🐝"
                required
                className="h-12"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(251, 191, 36, 0.05)",
                    borderColor: "rgb(251, 191, 36)",
                    "&:hover": {
                      borderColor: "rgb(251, 191, 36)",
                    },
                    "&.Mui-focused": {
                      borderColor: "rgb(251, 191, 36)",
                    },
                  },
                }}
              />
            </Box>
            <Box className="space-y-2.5">
              <Typography variant="body2" className="font-medium text-amber-700">
                Description
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Add the details of your task here..."
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(251, 191, 36, 0.05)",
                    borderColor: "rgb(251, 191, 36)",
                    "&:hover": {
                      borderColor: "rgb(251, 191, 36)",
                    },
                    "&.Mui-focused": {
                      borderColor: "rgb(251, 191, 36)",
                    },
                  },
                }}
              />
              <Typography variant="caption" className="text-amber-600 italic">
                Tip: Add all the important details to help track your progress 🍯
              </Typography>
            </Box>
          </Box>
          <Box className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={onClose}
              className="px-5 h-11 border-amber-200 text-amber-700 hover:bg-amber-50 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !title.trim()}
              className="px-5 h-11 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white rounded-xl shadow-sm flex items-center gap-2"
              icon={<Sparkles className="w-4 h-4" />}
            >
              {loading ? "Creating..." : "Create Task"}
            </Button>
          </Box>
        </DialogContent>
      </form>
    </Dialog>
  );
};