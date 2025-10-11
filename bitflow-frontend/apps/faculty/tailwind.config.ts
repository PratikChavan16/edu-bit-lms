import type { Config } from "tailwindcss";
import sharedConfig from "@bitflow/ui/tailwind-preset";

const config: Config = {
  presets: [sharedConfig],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
};

export default config;
