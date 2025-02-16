import React, { useState } from "react";
import { Dialog, DialogContent, Box, TextField } from "@mui/material";
import { Button } from "../atoms/Button";
import { Typography } from "../atoms/Typography";
import { Task } from "../../types/types";
import { updateTask } from "../services/boardService";
import { X, AlignLeft } from "lucide-react";

interface EditTaskModalProps {
  open: boolean;
  onClose: () => void;
  onTaskUpdated: () => void;
  task: Task;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  open,
  onClose,
  onTaskUpdated,
  task,
}) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateTask(task.id, { title, description });
      onTaskUpdated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
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
        className: "bg-white/95 rounded-2xl shadow-xl overflow-hidden",
      }}
    >
      <form onSubmit={handleSubmit}>
        <Box className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-500" />
        <Box className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20" />

        <DialogContent className="p-6 space-y-6">
          <Box className="flex items-center justify-between">
            <Typography variant="h5" className="text-amber-800 flex items-center gap-2">
              <Box className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <AlignLeft className="w-4 h-4 text-amber-600" />
              </Box>
              Edit Task
            </Typography>
            <Box className="relative">
              <Button
                variant="secondary"
                onClick={onClose}
                className="w-10 h-10 !p-0 rounded-full hover:bg-amber-100 text-amber-600 flex items-center justify-center"
                icon={<X className="absolute inset-0 m-auto w-5 h-5" />}
              />
            </Box>
          </Box>
          <Box className="space-y-5">
            <Box className="space-y-2.5">
              <Typography
                variant="body2"
                className="font-medium text-amber-700 flex items-center gap-1"
              >
                Task name
                <span className="text-amber-500">*</span>
              </Typography>
              <TextField
                fullWidth
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                required
                error={!!error}
                helperText={error}
                className="h-12 [&_.MuiOutlinedInput-root]:bg-amber-50/50 [&_.MuiOutlinedInput-root]:border-amber-400 [&_.MuiOutlinedInput-root:hover]:border-amber-400 [&_.MuiOutlinedInput-root.Mui-focused]:border-amber-400"
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
                placeholder="Add more details about this task..."
                className="[&_.MuiOutlinedInput-root]:bg-amber-50/50 [&_.MuiOutlinedInput-root]:border-amber-400 [&_.MuiOutlinedInput-root:hover]:border-amber-400 [&_.MuiOutlinedInput-root.Mui-focused]:border-amber-400"
              />
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
              disabled={loading}
              className="px-5 h-11 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white rounded-xl shadow-sm"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </DialogContent>
      </form>
    </Dialog>
  );
};
