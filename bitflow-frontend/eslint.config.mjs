import js from "@eslint/js";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/build/**",
      "**/.turbo/**",
      "**/coverage/**",
      "**/pnpm-lock.yaml"
    ]
  },
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      eslintPluginReact.configs.flat.recommended,
      eslintConfigPrettier
    ],
    plugins: {
      "react-hooks": eslintPluginReactHooks
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module"
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    rules: {
      ...eslintPluginReactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "react/prop-types": "off"
    }
  }
);
