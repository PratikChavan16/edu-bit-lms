import type { Config } from "tailwindcss";
import sharedPreset from "@bitflow/ui/tailwind-preset";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/**/*.{ts,tsx,mdx}",
  ],
  presets: [sharedPreset],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
