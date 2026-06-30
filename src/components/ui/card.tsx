import React from "react";
import { cn } from "../../lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";

export const Card = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ className, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "border border-border bg-card text-card-foreground shadow-lg overflow-hidden border-l-4 border-l-[var(--color-primary)]",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export const GlassCard = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ className, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("glass p-6 border-l-4 border-l-[var(--color-primary)]", className)}
      {...props}
    />
  )
);
GlassCard.displayName = "GlassCard";
