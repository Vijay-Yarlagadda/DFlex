import React from "react";
import { cn } from "../../lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost" | "glass";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02, skewX: -10 }}
        whileTap={{ scale: 0.98, skewX: -10 }}
        className={cn(
          "inline-flex items-center justify-center font-black uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:pointer-events-none disabled:opacity-50 skew-btn",
          {
            "bg-[var(--color-primary)] text-black hover:opacity-90 shadow-[0_0_20px_rgba(204,255,0,0.4)]": variant === "primary",
            "bg-[var(--color-secondary)] text-white hover:opacity-90 shadow-[0_0_20px_rgba(255,51,102,0.4)]": variant === "secondary",
            "bg-[var(--color-accent)] text-black hover:opacity-90 shadow-[0_0_20px_rgba(0,229,255,0.4)]": variant === "accent",
            "border-2 border-[var(--color-primary)] bg-transparent hover:bg-[var(--color-primary)] hover:text-black text-foreground": variant === "outline",
            "hover:bg-black/10 dark:hover:bg-white/10 text-foreground": variant === "ghost",
            "glass text-foreground": variant === "glass",
            "h-10 px-4 text-xs": size === "sm",
            "h-12 px-8 text-sm": size === "md",
            "h-14 px-10 text-base": size === "lg",
          },
          className
        )}
        {...props}
      >
        <span className="skew-btn-content flex items-center gap-2">{children}</span>
      </motion.button>
    );
  }
);
Button.displayName = "Button";
