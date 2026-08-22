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
        bgPrimary: "var(--bg-primary, #FAFAF9)",
        bgSurface: "var(--bg-surface, #FFFFFF)",
        bgElevated: "var(--bg-elevated, #F4F4F3)",
        borderSubtle: "var(--border-subtle, #E7E5E4)",
        textPrimary: "var(--text-primary, #1C1917)",
        textSecondary: "var(--text-secondary, #57534E)",
        textMuted: "var(--text-muted, #A8A29E)",
        accent: "var(--accent, #2563EB)",
        accentHover: "var(--accent-hover, #1D4ED8)",
        success: "var(--success, #15803D)",
        warning: "var(--warning, #B45309)",
        danger: "var(--danger, #B91C1C)",
      },
      fontFamily: {
        sans: ["Inter", "Geist", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["Geist Mono", "IBM Plex Mono", "Menlo", "Courier New", "monospace"],
      },
      borderRadius: {
        DEFAULT: "8px",
        card: "12px",
        modal: "16px",
      },
    },
  },
  plugins: [],
};
export default config;
