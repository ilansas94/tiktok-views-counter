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
        'tiktok-pink': '#fe2c55',
        'tiktok-black': '#161823',
        'tiktok-gray': '#f1f1f2',
      },
    },
  },
  plugins: [],
};

export default config;
