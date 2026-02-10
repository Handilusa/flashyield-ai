import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    neonBorder?: boolean;
}

export const Card = ({ children, className, neonBorder = false, ...props }: CardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={cn(
                "bg-monad-glass backdrop-blur-xl border border-monad-glass-border rounded-2xl p-6 transition-all duration-300 relative overflow-hidden group hover:bg-monad-glass-hover",
                neonBorder && "shadow-neon-purple border-monad-purple/30",
                className
            )}
            {...props}
        >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-monad-purple/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-monad-purple/10 to-transparent" />
            {children}
        </motion.div>
    );
}
