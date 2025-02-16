import React from "react";
import { Button } from "../../atoms/Button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  to?: string;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ to = "/boards", className = "" }) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="secondary"
      onClick={() => navigate(to)}
      icon={<ArrowLeft className="w-4 h-4" />}
      className={`text-amber-600 hover:text-amber-700 ${className}`}
    >
      Back
    </Button>
  );
};
