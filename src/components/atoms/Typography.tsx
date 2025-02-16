import React from "react";
import { cn } from "../../utils/cn";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body1" | "body2" | "caption";
  component?: keyof Pick<
    JSX.IntrinsicElements,
    "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span"
  >;
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = "body1",
  component,
  className,
  children,
  ...props
}) => {
  const variants = {
    h1: "text-4xl font-bold",
    h2: "text-3xl font-bold",
    h3: "text-2xl font-bold",
    h4: "text-xl font-bold",
    h5: "text-lg font-bold",
    h6: "text-base font-bold",
    body1: "text-base",
    body2: "text-sm",
    caption: "text-xs",
  };

  const Component =
    component ||
    ({
      h1: "h1",
      h2: "h2",
      h3: "h3",
      h4: "h4",
      h5: "h5",
      h6: "h6",
      body1: "p",
      body2: "p",
      caption: "span",
    }[variant] as keyof Pick<
      JSX.IntrinsicElements,
      "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span"
    >);

  return (
    <Component className={cn(variants[variant], className)} {...props}>
      {children}
    </Component>
  );
};
