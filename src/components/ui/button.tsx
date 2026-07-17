import * as React from 'react';
import { cn } from '../../lib/utils'; // I will create a utils file for tailwind merge

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth, children, ...props }, ref) => {
    const baseStyles = "relative font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center overflow-hidden skew-x-[-10deg]";
    
    const variants = {
      primary: "bg-[#CCFF00] text-black hover:bg-[#b3e600] shadow-[0_0_15px_rgba(204,255,0,0.3)] hover:shadow-[0_0_25px_rgba(204,255,0,0.5)]",
      secondary: "bg-[#FF3366] text-white hover:bg-[#e62e5c] shadow-[0_0_15px_rgba(255,51,102,0.3)] hover:shadow-[0_0_25px_rgba(255,51,102,0.5)]",
      outline: "bg-transparent border-2 border-[#CCFF00] text-[#CCFF00] hover:bg-[#CCFF00]/10",
      ghost: "bg-transparent text-zinc-400 hover:text-white skew-x-0"
    };

    const sizes = {
      sm: "h-9 px-4 text-xs",
      md: "h-12 px-8 text-sm",
      lg: "h-14 px-10 text-base"
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth ? "w-full" : "",
          className
        )}
        {...props}
      >
        <span className={variant !== 'ghost' ? "skew-x-[10deg]" : ""}>{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";
