import React from "react";
import { Box } from "../../atoms/Box";
import { TextField } from "../../atoms/TextField";
import { Search } from "lucide-react";
import type { TextFieldProps } from "@mui/material";

interface SearchFieldProps extends Omit<TextFieldProps, "variant"> {
  onSearch?: (value: string) => void;
}

export const SearchField: React.FC<SearchFieldProps> = ({ onSearch, ...props }) => {
  return (
    <Box className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-4 h-4" />
      <TextField
        {...props}
        className="bg-amber-400/20"
        sx={{
          "& .MuiOutlinedInput-root": {
            color: "white",
            paddingLeft: "2.5rem",
            "& fieldset": {
              borderColor: "white",
            },
            "&:hover fieldset": {
              borderColor: "white",
            },
            "&.Mui-focused fieldset": {
              borderColor: "white",
            },
          },
          "& .MuiInputBase-input::placeholder": {
            color: "rgba(255, 255, 255, 0.7)",
          },
          ...props.sx,
        }}
        onChange={e => {
          props.onChange?.(e);
          onSearch?.(e.target.value);
        }}
      />
    </Box>
  );
};
