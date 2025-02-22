import React from "react";
import { Box } from "../../atoms/Box";
import { Header } from "../../organisms/Header";

interface PageLayoutProps {
  children: React.ReactNode;
  onCreateTask?: () => void;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  onCreateTask,
  className = "",
}) => {
  return (
    <Box className={`min-h-screen bg-amber-50 ${className}`}>
      <Header onCreateTask={onCreateTask} />
      {children}
    </Box>
  );
};
