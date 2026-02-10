import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                monad: {
                    dark: "#0A0B0D",
                    purple: "#836EF9",
                    "purple-deep": "#4C1D95",
                    "purple-light": "#A78BFA",
                    cyan: "#00D9FF",
                    green: "#00FF88",
                    glass: "rgba(13, 14, 18, 0.4)",
                    "glass-border": "rgba(131, 110, 249, 0.2)",
                    "glass-hover": "rgba(131, 110, 249, 0.08)",
                },
            },
            boxShadow: {
                neon: "0 0 15px rgba(0, 217, 255, 0.4), 0 0 30px rgba(0, 217, 255, 0.2)",
                "neon-purple": "0 0 15px rgba(131, 110, 249, 0.4), 0 0 30px rgba(131, 110, 249, 0.2)",
                inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
            },
            animation: {
                "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "float": "float 6s ease-in-out infinite",
                "orbit": "orbit 20s linear infinite",
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-20px)" },
                },
                orbit: {
                    from: { transform: "rotate(0deg) translateX(100px) rotate(0deg)" },
                    to: { transform: "rotate(360deg) translateX(100px) rotate(-360deg)" },
                },
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "gradient-mesh": "radial-gradient(at 0% 0%, rgba(131, 110, 249, 0.15) 0, transparent 50%), radial-gradient(at 100% 0%, rgba(0, 217, 255, 0.1) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(0, 255, 136, 0.05) 0, transparent 50%), radial-gradient(at 0% 100%, rgba(76, 29, 149, 0.2) 0, transparent 50%)",
            },
        },
    },
    plugins: [],
};
export default config;
