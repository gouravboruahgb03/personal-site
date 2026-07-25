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
        // Dan Koe tokens (bg=black, text=white come from Tailwind defaults)
        muted: "var(--text-muted)",
        faint: "var(--text-faint)",
        rule: "var(--rule)",
        surface: "var(--surface)",
      },
      fontFamily: {
        sans: ["var(--font-satoshi)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1200px", // centred page container
        prose: "68ch", // reading measure for post body
      },
    },
  },
  plugins: [],
};
export default config;
