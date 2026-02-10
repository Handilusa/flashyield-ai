import { ReactNode } from "react";
import { Card } from "./Card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatCardProps {
    title: string;
    value: string;
    icon: ReactNode;
    trend?: string;
    trendUp?: boolean;
}

export function StatCard({ title, value, icon, trend, trendUp }: StatCardProps) {
    return (
        <Card className="flex flex-col gap-4 relative group">
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{title}</p>
                    <h3 className="text-2xl font-black text-white tracking-tight">{value}</h3>
                </div>
                <div className="p-2.5 bg-monad-purple/10 rounded-xl border border-monad-purple/20 group-hover:border-monad-purple/40 transition-colors shadow-inner">
                    {icon}
                </div>
            </div>

            {trend && (
                <div className="flex items-center gap-2 pt-2 border-t border-monad-glass-border">
                    <div className={cn(
                        "flex items-center gap-1 text-[10px] font-black tracking-wider px-2 py-0.5 rounded-full",
                        trendUp ? "bg-monad-green/10 text-monad-green" : "bg-red-500/10 text-red-500"
                    )}>
                        {trendUp ? "↑" : "↓"} {trend}
                    </div>
                </div>
            )}
        </Card>
    );
}
