"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { motion } from "framer-motion";

interface ChartDataPoint {
    time: string;
    Alpha: number;
    Beta: number;
    Gamma: number;
}

interface YieldChartProps {
    data: ChartDataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-card p-3 !bg-[#1A1A2E]/90 border border-white/10 shadow-xl">
                <p className="text-gray-400 text-xs mb-2">{label}</p>
                {payload.map((entry: any) => (
                    <div key={entry.name} className="flex items-center gap-2 mb-1 last:mb-0">
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm font-medium text-gray-200">
                            {entry.name}:
                        </span>
                        <span className="text-sm font-bold text-white">
                            {Number(entry.value).toFixed(4)}%
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export function YieldChart({ data }: YieldChartProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card w-full h-[400px] p-4 flex flex-col"
        >
            <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    📈 Yield Progression
                </h3>
                <span className="text-xs text-gray-500">Live Simulation Data</span>
            </div>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis
                            dataKey="time"
                            stroke="#6b7280"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            stroke="#6b7280"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            domain={["auto", "auto"]}
                            tickFormatter={(val) => `${val.toFixed(2)}%`}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#ffffff20" }} />
                        <Legend wrapperStyle={{ paddingTop: "10px" }} />

                        <Line
                            type="monotone"
                            dataKey="Alpha"
                            stroke="#F59E0B" // Amber/Gold
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4, strokeWidth: 0 }}
                            animationDuration={1000}
                        />
                        <Line
                            type="monotone"
                            dataKey="Beta"
                            stroke="#3B82F6" // Blue
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4, strokeWidth: 0 }}
                            animationDuration={1000}
                        />
                        <Line
                            type="monotone"
                            dataKey="Gamma"
                            stroke="#A855F7" // Purple
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4, strokeWidth: 0 }}
                            animationDuration={1000}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
