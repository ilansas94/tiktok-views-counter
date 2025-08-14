import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'tiktok-pink': '#fe2c55',
        'tiktok-black': '#161823',
        'tiktok-gray': '#f1f1f2',
      },
    },
  },
  plugins: [],
};

export default config;
