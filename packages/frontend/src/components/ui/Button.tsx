import { ButtonHTMLAttributes, forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "cyan";
    size?: "default" | "sm" | "lg" | "icon";
    asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps & HTMLMotionProps<"button">>(
    ({ className, variant = "primary", size = "default", ...props }, ref) => {
        const variantStyles = {
            primary: "bg-gradient-to-r from-monad-purple to-monad-purple-deep text-white shadow-neon-purple hover:shadow-purple-500/40 border border-monad-purple-light/20",
            secondary: "bg-monad-glass text-monad-purple border border-monad-glass-border hover:bg-monad-glass-hover hover:border-monad-purple/30",
            outline: "border-2 border-monad-purple text-monad-purple hover:bg-monad-purple/10",
            ghost: "hover:bg-monad-glass-hover text-gray-400 hover:text-white",
            danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20",
            cyan: "bg-gradient-to-r from-monad-cyan to-blue-500 text-black shadow-neon font-black",
        };

        const sizeStyles = {
            default: "h-11 px-6 py-2",
            sm: "h-9 px-4",
            lg: "h-16 px-10 text-base uppercase tracking-wider",
            icon: "h-10 w-10",
        };

        return (
            <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    "inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-monad-purple disabled:pointer-events-none disabled:opacity-50 active:scale-95 gap-2",
                    variantStyles[variant],
                    sizeStyles[size],
                    className
                )}
                ref={ref as any}
                {...(props as any)}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };
